const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/user.model.js');
const PostModel = require('../models/post.model.js');
const { deleteFile, uploadFile } = require('../../lib/aws.lib.js');
const CodeEnum = require('../../utils/statusCodes.util.js');

exports.getPosts = async () => {
    const posts = await PostModel.find({});

    // for await (const post of posts) {
    //         const user = await UserModel.findById(post.author).lean();
    //         post.author = user.username;
    //     }
    await Promise.all(
        posts.map(async post => {
            const user = await UserModel.findById(post.author).lean();
            post.author = user.username;
        })
    );

    return posts;
};

exports.getPost = async id => {
    const post = await PostModel.findById(id).lean();

    const user = await UserModel.findById(post.author).lean();
    post.author = user.username;
    post.authorImg = user.img;
    return post;
};

exports.createPost = async body => {
    const file = body.img;
    const FileId = uuidv4();
    const result = await uploadFile(file, FileId);

    const newPost = await PostModel.create({
        img: result.Location,
        author: body.author,
        description: body.description,
        likes: ['']
        // comments: ['']
    });
    return newPost;
};

exports.deletePost = async id => {
    const post = await PostModel.findOne({
        _id: id
    }).lean();
    if (post === null) {
        throw {
            code: CodeEnum.PostNotExist,
            message: `post not exist`
        };
    }
    await PostModel.findOneAndDelete({
        _id: id
    }).lean();

    deleteFile(post.img);
};

exports.updatePost = async (id, description) => {
    const post = await PostModel.findByIdAndUpdate(
        {
            _id: id
        },
        {
            description: description
        }
    );

    if (post === null) {
        throw {
            code: CodeEnum.PostNotExist,
            message: `Post not exist`
        };
    }

    return post;
};

exports.likePost = async (id, userId) => {
    await PostModel.findByIdAndUpdate(
        {
            _id: id
        },
        {
            $push: {
                likes: userId
            }
        }
    ).then(res => {
        if (res === null) {
            throw {
                code: CodeEnum.PostNotExist,
                message: `Post not exist`
            };
        }
    });

    await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $push: {
                liked: id
            }
        }
    ).then(res => {
        if (res === null) {
            throw {
                code: CodeEnum.PostNotExist,
                message: `User not exist`
            };
        }
    });
};

exports.unlikePost = async (id, userId) => {
    await PostModel.findByIdAndUpdate(
        {
            _id: id
        },
        {
            $pull: {
                likes: userId
            }
        }
    ).then(res => {
        if (res === null) {
            throw {
                code: CodeEnum.PostNotExist,
                message: `User not exist`
            };
        }
    });
    await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $pull: {
                liked: id
            }
        }
    ).then(res => {
        if (res === null) {
            throw {
                code: CodeEnum.PostNotExist,
                message: `User not exist`
            };
        }
    });
};

exports.getTimelineUser = async id => {
    const user = await UserModel.findById({ _id: id });
    if (user.followings === null) {
        return null;
    }
    await user.followings.pull(user._id);
    const posts = await PostModel.find({
        author: {
            $in: user.followings
        }
    })
        .sort({ createdAt: -1 })
        .lean();

    await Promise.all(
        posts.map(async post => {
            const currentUser = await UserModel.findById(post.author).lean();
            post.author = currentUser.username;
        })
    );

    //     // for await (const post of posts) {
    // //         const user = await UserModel.findById(post.author).lean();
    // //         post.author = user.username;
    // //     }
    // await Promise.all(
    //     posts.map(async post => {
    //         const user = await UserModel.findById(post.author).lean();
    //         post.author = user.username;
    //     })
    // );

    return posts;
};

exports.getExploreUser = async id => {
    const user = await UserModel.findById({ _id: id });
    const posts = await PostModel.find({
        author: {
            $nin: user.followings,
            $ne: user._id
        }
    })
        .sort({ createdAt: -1 })
        .lean();

    const postArray = Array.from(posts);
    const updatedPosts = await Promise.all(
        postArray.map(async post => {
            const currentUser = await UserModel.findById(post.author).lean();
            if (currentUser) {
                return {
                    ...post,
                    author: currentUser.username
                };
            }
            return post;
        })
    );
    return updatedPosts;
};

exports.getUserPosts = async id => {
    const posts = await PostModel.find({
        author: id
    }).lean();

    posts.sort((a, b) => {
        if (!a.createdAt) {
            return 1;
        }
        if (!b.createdAt) {
            return -1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return posts;
};

exports.likedPosts = async id => {
    const user = await UserModel.findOne({ _id: id }).lean();

    const array = [];
    for (let i = 0; i < user.liked.length; i++) {
        await PostModel.findOne({ _id: user.liked[i] })
            .lean()
            .then(res => {
                array.push(res);
            });
    }
    return array;
};
