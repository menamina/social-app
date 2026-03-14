const prisma = require("../prisma/client");
const { hashPass } = require("../utils/password");
const path = require("path");
const fs = require("fs").promises;

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

async function sendIMGS(req, res) {
  try {
    const img = req.params.image;
    const imgPath = path.resolve("uploads", img);
    return res.sendFile(imgPath);
  } catch (error) {
    console.log(error);
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
        comments: {
          include: {
            user: {
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
          },
          orderBy: {
            createdAt: "asc",
          },
        },
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
        comments: {
          include: {
            user: {
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
          },
          orderBy: {
            createdAt: "asc",
          },
        },
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
        reposts: {
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
            repostedAt: "desc",
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

async function getPost(req, res) {
  try {
    const { postId } = req.params;
    const id = req.user.id;
    const userID = Number(id);
    const postID = Number(postId);

    const post = await prisma.posts.findUnique({
      where: {
        id: postID,
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
        comments: {
          include: {
            user: {
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
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        reposts: true,
      },
    });

    if (!post) {
      return res.status(404).json({ errorMsg: "Post not found" });
    }

    return res.json({ post });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function search(req, res) {
  try {
    const { query } = req.query;
    const userSearchRes = await prisma.user.findMany({
      where: {
        username: {
          in: query
        }
      },
      select: {
        id: true,
        name: true,
        username: true,
        profile: {
          select: {
            pfp: true
          }
        }
      }
    })

    const postSearchRes = await prisma.posts.findMany({
      where: {
        msg: {
          in: query
        }
      }
    })

    if (!userSearchRes && !postSearchRes){
      return res.status(404).json({ errorMsg: "no search results found" });
    }
    
    return res.status(200).json({ userSearchRes, postSearchRes });

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
    const pfp = req.file ? req.file.path : null;

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
    const seenUserIDs = new Set();
    const noDupesList = [];

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
            profile: {
              select: {
                pfp: true
              }
            }
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            profile: {
              select: {
                pfp: true
              }
            }
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    queryRes.forEach((msg) => {
      const otherUser =
        msg.receiverID === thisUsersID ? msg.sender : msg.receiver;

      if (!seenUserIDs.has(otherUser.id)) {
        seenUserIDs.add(otherUser.id);
        noDupesList.push({
          id: otherUser.id,
          username: otherUser.username,
          name: otherUser.name,
          pfp: otherUser.profile.pfp
        });
      }
    });

    return res.status(200).json({ sideBarDMS: noDupesList });
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
          orderBy: {
            createdAt: "asc"
          }
        },
        receivedMessages: {
          where: {
            senderID: withThisUSER,
          },
          orderBy: {
            createdAt: "asc"
          }
        },
      }
    });

      return res.status(200).json({ one2one: queryRes });

  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function sendMsg(req, res) {
  try {
    const { sendToID, msg } = req.body;
    const files = req.files ? req.files.map((file) => file.path) : [];
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
        images: files.length > 0 ? files : null,
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

async function post(req, res) {
  try {
    const { body } = req.body;
    const files = req.files ? req.files.map((file) => file.path) : [];

    const id = req.user.id;
    const userID = Number(id);

    await prisma.posts.create({
      data: {
        madeBy: userID,
        msg: body,
        images: files.length > 0 ? files : null,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function deletePost(req, res) {
  try {
    const id = req.user.id;
    const { postID } = req.body;

    const userID = Number(id);
    const deleteThisPost = Number(postID);

    const post = await prisma.posts.findUnique({
      where: {
        id: deleteThisPost,
        madeBy: userID,
      },
      select: {
        img: true,
      },
    });

    if (post && post.img) {
      for (const imagePath of post.img) {
        try {
          await fs.unlink(imagePath);
        } catch (err) {
          console.error(`Failed to delete image: ${imagePath}`, err);
        }
      }
    }

    await prisma.posts.delete({
      where: {
        id: deleteThisPost,
        madeBy: userID,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function repost(req, res) {
  try {
    const { idtorep } = req.body;
    const uID = req.user.id;

    const userID = Number(uID);
    const repostID = Number(idtorep);

    await prisma.reposts.create({
      data: {
        postID: repostID,
        repostedBy: userID,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function removeRepost(req, res) {
  try {
     const { idtorep } = req.body;
    const uID = req.user.id;

    const userID = Number(uID);
    const repostID = Number(idtorep);

    await prisma.reposts.delete({
      where: {
        postID: repostID,
        repostedBy: userID,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function like(req, res) {
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
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function removeLike(req, res) {
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
    return res.status(200).json({ success: true });
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
    return res.status(200).json({ success: true });
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

  sendIMGS,

  forYouFeed,
  followingFeed,
  getNavData,
  viewProfile,

  getPost,
  search,
  settings,
  updateProfileSettings,

  followThem,
  unfollowThem,

  like,
  removeLike,
  repost,
  removeRepost,
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
