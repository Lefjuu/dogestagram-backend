import mongoose from 'mongoose'
import AutoIncrement from 'mongoose-sequence'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const PostSchema = mongoose.Schema(
    {
        author: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        likes: {
            type: Array
        },
        comments: [
            {
                comment: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: false,
                    ref: 'Comment'
                }
            }
        ]
    },
    { timestamps: true }
)

export default mongoose.model('Post', PostSchema)

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - author
 *         - description
 *         - img
 *       properties:
 *         author:
 *           type: string
 *           description: The author of the post
 *         description:
 *           type: string
 *           description: The description of the post
 *         img:
 *           type: string
 *           description: The URL of the image associated with the post
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *             description: The ID of the user who liked the post
 *           description: The list of users who liked the post
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the comment associated with the post
 *             description: The list of comments associated with the post
 *       example:
 *         author: John Doe
 *         description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 *         img: https://example.com/image.jpg
 *         likes: [ "63fb6b0df5e286b9b0c15451", "63fa72348f58d82bb9d35f8f", "63fb6755f5e286b9b0c15322" ]
 *         comments: [ { "comment": "comment1" }, { "comment": "comment2" } ]
 */
