class PostController {
    constructor(postServices) {
        this.postServices = postServices;
        this.createPost = this.createPost.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    async createPost(req, res) {
        const post = await this.postServices.createPost(req.body);
        if (post.status === "success") {
            res.status(post.statusCode).json({
                status: "success",
                data: post.data,
            });
        } else {
            res.status(post.statusCode).json({
                status: "fail",
                message: post.err,
            });
        }
    }
    async deletePost(req, res) {
        const deleted = await this.postServices.deletePost(req.params.postId);
        if (deleted.status === "success") {
            res.status(deleted.statusCode).json({
                status: "success",
                data: deleted.data,
            });
        } else {
            res.status(deleted.statusCode).json({
                status: "fail",
                message: deleted.err,
            });
        }
    }

    async updatePost(req, res) {
        const updated = await this.postServices.updatePost(
            req.params.postId,
            req.body
        );
        if (updated.status === "success") {
            res.status(updated.statusCode).json({
                status: "success",
                data: updated.data,
            });
        } else {
            res.status(updated.statusCode).json({
                status: "fail",
                message: updated.err,
            });
        }
    }
}

module.exports = PostController;
