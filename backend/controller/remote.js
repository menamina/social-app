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
    const id = req.user.id;
    const userID = Number(id);

    const blockedUsers = await prisma.blocked.findMany({
      where: {
        blockerID: userID,
      },
      select: {
        blockedID: true,
      },
    });

    const blockedIDs = blockedUsers.map((blocked) => blocked.blockedID);

    const allPosts = await prisma.posts.findMany({
      where: {
        // likes: { gte: 2 },
        // comments: { gte: 2 },
        madeBy: { notIn: blockedIDs },
      },
      include: {
        postedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            profile: {
              select: {
                pfp: true,
              },
            },
          },
        },
        likes: true,
        comments: true,
        reposts: true,
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
      include: {
        postedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            profile: {
              select: {
                pfp: true,
              },
            },
          },
        },
        likes: true,
        comments: true,
        reposts: true,
      },
      orderBy: [{ likes: "desc" }, { comments: "desc" }],
    });

    return res.status(200).json({ followingPosts: followingPosts });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function getNavData(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);

    const navData = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        id: true,
        username: true,
        name: true,
        profile: {
          select: {
            pfp: true,
          },
        },
      },
    });

    if (!navData) {
      return res.status(404).json({ errorMsg: "User not found" });
    }

    return res.json({ navData });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function viewProfile(req, res) {
  try {
    const id = req.user.id;
    const { profile } = req.params;

    const userID = Number(id);

    const username = profile.startsWith("@") ? profile.slice(1) : profile;

    const wantedUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    if (!wantedUser) {
      return res.status(404).json({ errorMsg: "User not found" });
    }

    const wantedProfile = wantedUser.id;

    const blockRelations = await prisma.blocked.findMany({
      where: {
        OR: [
          { blockerID: userID, blockedID: wantedProfile },
          { blockerID: wantedProfile, blockedID: userID },
        ],
      },
    });

    const youBlockedThem = blockRelations.some(
      (block) =>
        block.blockerID === userID && block.blockedID === wantedProfile,
    );
    const theyBlockedYou = blockRelations.some(
      (block) =>
        block.blockerID === wantedProfile && block.blockedID === userID,
    );

    if (theyBlockedYou) {
      return res.status(403).json({ errorMsg: "This user has blocked you" });
    }

    if (youBlockedThem) {
      return res.status(403).json({ errorMsg: "You have blocked this user" });
    }

    const userProfile = await prisma.user.findUnique({
      where: {
        id: wantedProfile,
      },
      select: {
        id: true,
        name: true,
        username: true,
        profile: {
          select: {
            pfp: true,
          },
        },
        following: true,
        followers: true,
        posts: {
          include: {
            postedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                profile: {
                  select: {
                    pfp: true,
                  },
                },
              },
            },
            likes: true,
            comments: true,
            reposts: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            post: {
              include: {
                postedBy: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    profile: {
                      select: {
                        pfp: true,
                      },
                    },
                  },
                },
                likes: true,
                comments: true,
                reposts: true,
              },
            },
          },
          orderBy: {
            likedAt: "desc",
          },
        },
        comments: {
          include: {
            post: {
              include: {
                postedBy: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    profile: {
                      select: {
                        pfp: true,
                      },
                    },
                  },
                },
                likes: true,
                comments: true,
                reposts: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (userProfile.id === userID) {
      return res.json({ viewThisUserProfile: userProfile });
    }
    return res.json({ userProfile: userProfile });
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

    return res.json({ userSettings });
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
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function dms(req, res) {
  try {
    const id = req.user.id;
    const thisUsersID = Number(id);
    let filteredDMs = [];

    const queryRes = await prisma.msgs.findMany({
      where: {
        OR: [{ senderID: thisUsersID }, { receiverID: thisUsersID }],
      },

      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    queryRes.forEach((msgs) => {
      const otherUser =
        msgs.receiverID === thisUsersID ? msgs.senderID : receiverID;
      if (!filteredDMs.has(otherUser)) {
        filteredDMs.push(otherUser);
      }
    });

    const newSetFilteredDms = new Set(filteredDMs);

    return res.json({ sideBarDMS: newSetFilteredDms });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function one2oneDMS(req, res) {
  try {
    const id = req.user.id;
    const { wUser } = req.params;

    const thisUsersID = Number(id);
    const withThisUSER = Number(wUser);

    const queryRes = await prisma.user.findUnique({
      where: {
        id: thisUsersID,
      },
      select: {
        sentMessages: {
          where: {
            receiverID: withThisUSER,
            deletedBySender: false,
          },
        },
        receivedMessages: {
          where: {
            senderID: withThisUSER,
          },
        },
      },
    });

    return res.json({ one2one: queryRes });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function sendMsg(req, res) {
  try {
    const { sendToID, msg } = req.body;
    const { image } = req.file;
    const { id } = req.user;

    const sendTo = Number(sendToID);
    const thisUsersID = Number(id);

    const blockExists = await prisma.blocked.findFirst({
      where: {
        OR: [
          { blockerID: thisUsersID, blockedID: sendTo },
          { blockerID: sendTo, blockedID: thisUsersID },
        ],
      },
    });

    if (blockExists) {
      return res
        .status(403)
        .json({ errorMsg: "Cannot send message to this user" });
    }

    await prisma.msgs.create({
      data: {
        senderID: thisUsersID,
        receiverID: sendTo,
        message: msg,
        image: image ? image : null,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function deleteMsg(req, res) {
  try {
    const { id } = req.user;
    const { deleteThisMsgID } = req.body;

    const thisUsersID = Number(id);
    const deleteThisMsg = Number(deleteThisMsgID);

    await prisma.user.update({
      where: {
        id: thisUsersID,
      },
      data: {
        sentMessages: {
          update: {
            where: {
              id: deleteThisMsg,
            },
            data: {
              deletedBySender: true,
            },
          },
        },
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

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

    return res.status(200).jjson({ success: true });
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
    return res.status(200).jjson({ success: true });
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
    return res.status(200).jjson({ success: true });
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
    return res.status(200).jjson({ success: true });
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
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function followThem(req, res) {
  try {
    const id = req.user.id;
    const { followThemID } = req.body;

    const userID = Number(id);
    const followThem = Number(followThemID);

    await prisma.follow.create({
      data: {
        followerID: userID,
        followingID: followThemID,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function unfollowThem(req, res) {
  try {
    const id = req.user.id;
    const { unfollowThemID } = req.body;

    const userID = Number(id);
    const unfollowThem = Number(unfollowThemID);

    await prisma.follow.delete({
      where: {
        followerID: userID,
        followingID: unfollowThem,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function blockThem(req, res) {
  try {
    const id = req.user.id;
    const { blockThemID } = req.body;

    const userID = Number(id);
    const blockThem = Number(blockThemID);

    await prisma.blocked.create({
      data: {
        blockerID: userID,
        blockedID: blockThem,
      },
    });

    await prisma.follow.delete({
      where: {
        followerID: userID,
        followingID: blockThem,
      },
    });

    await prisma.follow.delete({
      where: {
        followerID: blockThem,
        followingID: userID,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function getBlockedUsers(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);

    const blockedRelations = await prisma.blocked.findMany({
      where: {
        blockerID: userID,
      },
      select: {
        blockedID: true,
      },
    });

    const blockedIDs = blockedRelations.map((b) => b.blockedID);

    const blockedUsers = await prisma.user.findMany({
      where: {
        id: { in: blockedIDs },
      },
      select: {
        id: true,
        username: true,
        name: true,
        pfp: true,
      },
    });

    return res.json({ blockedUsers });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function unblockThem(req, res) {
  try {
    const id = req.user.id;
    const { unblockThemID } = req.body;

    const userID = Number(id);
    const unblockThem = Number(unblockThemID);

    await prisma.blocked.delete({
      where: {
        blockerID: userID,
        blockedID: unblockThem,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

module.exports = {
  signup,
  forYouFeed,
  followingFeed,
  getNavData,
  viewProfile,
  //   search,
  settings,
  updateProfileSettings,

  followThem,
  unfollowThem,

  like,
  removeLike,
  //   repost,
  //   removeRepost,
  comment,
  deleteComment,
  post,
  deletePost,

  dms,
  one2oneDMS,
  sendMsg,
  deleteMsg,

  blockThem,
  unblockThem,
  getBlockedUsers,
};
