const router = require("express").Router();
// const passport = require("passport");

router.get("/:id", (req, res) => {
  // Check if req.params.id exists or not
  if (req.params.id) {
    res.status(200).json({
      error: false,
      message: "Room info",
      roomInfo: {
        name: "my room",
        location: "",
        id: req.params.id,
      },
    });
  } else {
    res.status(400).json({ error: true, message: "Missing parameter: id" });
  }
});

export default router;
