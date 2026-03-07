const prisma = require("../prisma/client");
const { hashPass } = require("../utils/password");

async function signup(req, res) {
  try {
    const { name, username, email, password } = req.body;
    const saltHash = await hashPass(password);
    await prisma.user.create({
      data: {
        name: name,
        username: username,
        email: email,
        saltedHash: saltHash,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ errorMsg: "Internal server error :^(" });
  }
}

async function forYouFeed(req, res) {
  try {
    const allPosts = await prisma.posts.findMany({
      where: {
        likes: { gte: 2 },
        comments: { gte: 2 },
      },
      orderBy: [{ likes: "desc" }, { comments: "desc" }],
    });
    return res.status(200).json({ allPosts: allPosts });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function followingFeed(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);
    const followingList = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        following: {
          select: {
            id: true,
          },
        },
      },
    });

    const followingIDs = followingList.following.map((user) => user.id);

    const followingPosts = await prisma.posts.findMany({
      where: {
        madeBy: { in: followingIDs },
      },
    });

    return res.status(200).json({ followingPosts });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function profile(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);

    const userProfile = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          orderBy: {
            likedAt: "desc",
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
        following: true,
        followers: true,
      },
    });

    res.json({ userProfile });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function search(req, res) {
  try {
    const { query } = req.params.search;
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function settings(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);

    const userSettings = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        profile: true,
      },
    });

    res.json({ userSettings });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function updateProfileSettings(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);

    const { name, username, email, accountStatus } = req.body;
    const { pfp } = req.file;

    await prisma.profile.update({
      where: {
        user: userID,
      },
      data: {
        pfp: pfp ? pfp : "default-png",
        name: name,
        username: username,
        email: email,
        accountStatus: accountStatus,
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function dms(req, res) {}

async function post(res, res) {
  try {
    const { body } = req.body;

    const id = req.user.id;
    const userID = Number(id);

    await prisma.posts.create({
      data: {
        madeBy: userID,
        msg: body,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function deletePost(res, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);

    await prisma.posts.delete({
      where: {
        madeBy: userID,
      },
    });

    res.status(200).jjson({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function repost(res, res) {
  try {
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function removeRepost(res, res) {
  try {
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function like(res, res) {
  try {
    const post = req.body.postID;
    const postID = Number(post);
    const uID = req.user.id;
    const userID = Number(uID);

    await prisma.likes.create({
      data: {
        postID: postID,
        idOfLiker: userID,
      },
    });
    res.status(200).jjson({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function removeLike(res, res) {
  try {
    const post = req.body.postID;
    const postID = Number(post);
    const uID = req.user.id;
    const userID = Number(uID);

    await prisma.likes.delete({
      where: {
        postID: postID,
        idOfLiker: userID,
      },
    });
    res.status(200).jjson({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function comment(req, res) {
  try {
    const post = req.body.postID;
    const postID = Number(post);
    const uID = req.user.id;
    const userID = Number(uID);

    const { commentBody } = req.body.comment;

    await prisma.comments.create({
      data: {
        postID: postID,
        commenterID: userID,
        comment: commentBody,
      },
    });
    res.status(200).jjson({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function deleteComment(req, res) {
  try {
    const post = req.body.postID;
    const postID = Number(post);
    const uID = req.user.id;
    const userID = Number(uID);

    const { commentNum } = req.body.commentID;
    const commentID = Number(commentNum);

    await prisma.comments.delete({
      where: {
        postID: postID,
        commenterID: userID,
        id: commentID,
      },
    });
    res.status(200).jjson({ success: true });
    res.status(200).jjson({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function sendMsg(req, res) {
  try {
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function deleteMsg(req, res) {
  try {
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

module.exports = {
  signup,
  forYouFeed,
  followingFeed,
  profile,
  //   search,
  settings,
  updateProfileSettings,
  dms,
  post,
  deletePost,
  //   repost,
  //   removeRepost,
  like,
  removeLike,
  comment,
  deleteComment,
  sendMsg,
  deleteMsg,
};
