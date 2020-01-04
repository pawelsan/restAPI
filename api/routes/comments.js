const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Comments were fetched"
    });
});

router.post("/", (req, res, next) => {
    const comment = {
        commendId: req.body.productId
    }
    res.status(201).json({
        message: "Comment was created",
        comment: comment
    });
});

router.get("/:commentId", (req, res, next) => {
    const id = req.params.commentId;
    res.status(200).json({
        message: "Comment id is " + id,
        id: id,
    });
});

// router.post("/:commentId", (req, res, next) => {
//     const id = req.params.commentId;
//     res.status(201).json({
//         message: "Comment id is " + id,
//         id: id,
//     });
// });


router.delete("/:commentId", (req, res, next) => {
    const id = req.params.commentId;
    res.status(200).json({
        message: "Deleted comment: " + id,
        id: id,
    });
});

module.exports = router;