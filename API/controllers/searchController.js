class CommentController {
  constructor({ SearchService }) {
    this.SearchService = SearchService;
  }

  search = async (req, res) => {
    //Default values of query parameters
    const QUERY = "nonlegit";
    const LIMIT = 5;
    const PAGE = 1;
    const TYPE = "posts";
    const TIME = "all";
    const SORT = "createdAt";
    const SEARCH_TYPES = ["posts", "comments", "communities", "people"];
    const TIMES = ["hour", "day", "week", "month", "year", "all"];
    const sortTypes = new Map([
      ["new", "createdAt"],
      ["top", "votes"],
      ["hot", "sortOnHot"],
      ["comments", "commentCount"],
    ]);

    //Getting query parameters
    let { type, page, limit, sort, time } = req.query;
    const q = req.query.q || QUERY;

    if (isNaN(limit) || !limit || limit < 1) limit = LIMIT;
    if (isNaN(page) || !page || page < 1) page = PAGE;
    if (!SEARCH_TYPES.includes(type)) type = TYPE;
    if (!TIMES.includes(time)) time = TIME;
    sort = sortTypes.get(sort) || SORT;

    const result = await this.SearchService.search(q, type, page, limit, sort, time);

    res.status(200).json({
      status: "success",
      data: result,
    });
  };
}

module.exports = CommentController;
