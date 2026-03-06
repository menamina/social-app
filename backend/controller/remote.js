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

module.exports = {
  signup,
  forYouFeed,
  followingFeed,
  profile,
};
