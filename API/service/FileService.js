/**
 * FileService Class for handleing files and images and videos
 */
class FileService {
  constructor({ UserRepository, PostRepository, SubredditRepository }) {
    this.UserRepository = UserRepository;
    this.PostRepository = PostRepository;
    this.SubredditRepository = SubredditRepository;
  }
}
module.exports = FileService;
