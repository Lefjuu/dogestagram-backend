import mongoose from 'mongoose'

const CommentSchema = mongoose.Schema(
    {
        post: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model('Comment', CommentSchema)

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - post
 *         - author
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the object.
 *         post:
 *           type: string
 *           description: Unique identifier for the related post.
 *         author:
 *           type: string
 *           description: Name of the author.
 *         description:
 *           type: string
 *           description: Description of the object.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time of the object's creation.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time of the object's last update.
 *         __v:
 *           type: integer
 *           description: Version number of the object.
 */
