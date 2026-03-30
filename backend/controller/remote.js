const prisma = require("../prisma/client");
const { hashPass } = require("../utils/password");
const path = require("path");
const fs = require("fs").promises;

async function signup(req, res) {
  try {
    const { name, username, email, password } = req.body;

    const isThereAUserName = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    const isThereAnEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isThereAUserName) {
      return res.status(401).json({ usernameTaken: true });
    } else if (isThereAnEmail) {
      return res.status(401).json({ emailTaken: true });
    } else {
      const saltHash = await hashPass(password);
      const newUser = await prisma.user.create({
        data: {
          name: name,
          username: username,
          email: email,
          saltedHash: saltHash,
        },
      });

      await prisma.profile.create({
        data: {
          user: newUser.id,
          name: name,
          username: username,
          email: email,
        },
      });

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(400).json({ errorMsg: "Internal server error :^(" });
  }
}

async function sendIMGS(req, res) {
  try {
    const img = req.params.image;
    const imgPath = path.resolve(__dirname, "..", "uploads", img);
    return res.sendFile(imgPath);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ errorMsg: "Image not found" });
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
        commentReplies: true,
        reposts: true,
      },
      orderBy: { createdAt: "desc" },
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
        commentReplies: true,
        reposts: true,
      },
      orderBy: { createdAt: "desc" },
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
        username,
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
      const blockedUserProfile = await prisma.user.findUnique({
        where: { id: wantedProfile },
        select: {
          id: true,
          name: true,
          username: true,
          profile: {
            select: {
              pfp: true,
            },
          },
        },
      });
      return res.status(403).json({
        youAreBlocked: "This user has blocked you",
        blockedUserProfile: blockedUserProfile,
      });
    }

    if (youBlockedThem) {
      const blockedUserProfile = await prisma.user.findUnique({
        where: { id: wantedProfile },
        select: {
          id: true,
          name: true,
          username: true,
          profile: {
            select: {
              pfp: true,
            },
          },
        },
      });
      return res.status(403).json({
        youBlocked: "You have blocked this user",
        blockedUserProfile: blockedUserProfile,
      });
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
            commentReplies: true,
            reposts: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    profile: {
                      select: {
                        pfp: true,
                      },
                    },
                  },
                },
              },
            },
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
                commentReplies: true,
                reposts: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        username: true,
                        profile: {
                          select: {
                            pfp: true,
                          },
                        },
                      },
                    },
                  },
                },
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
                commentReplies: true,
                reposts: true,
              },
            },
          },
          orderBy: {
            likedAt: "desc",
          },
        },
      },
    });

    if (userProfile.id === userID) {
      return res.json({ viewThisUserProfile: userProfile });
    }
    return res.json({ userProfile: userProfile });
  } catch (error) {
    console.error("Error in viewProfile:", error);
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function getPost(req, res) {
  try {
    const { postId } = req.params;
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
        commentReplies: {
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
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        commentOnPost: {
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
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
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
      },
    });

    const postSearchRes = await prisma.posts.findMany({
      where: {
        msg: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            username: true,
            profile: {
              select: {
                pfp: true,
              },
            },
          },
        },
        likes: true,
        commentReplies: true,
        reposts: true,
      },
    });

    if (!userSearchRes && !postSearchRes) {
      return res.status(404).json({ errorMsg: "no search results found" });
    }

    return res.status(200).json({ userSearchRes, postSearchRes });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function dmMsgSearch(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);
    const { query } = req.query;

    const results = await prisma.msgs.findMany({
      where: {
        AND: [
          {
            OR: [{ senderID: userID }, { receiverID: userID }],
          },
          {
            OR: [
              { message: { contains: query, mode: "insensitive" } },
              {
                sender: {
                  username: { contains: query, mode: "insensitive" },
                  NOT: { id: userID },
                },
              },
              {
                receiver: {
                  username: { contains: query, mode: "insensitive" },
                  NOT: { id: userID },
                },
              },
            ],
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            profile: {
              select: {
                pfp: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
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
    });

    if (results.length === 0) {
      return res.status(404).json({ errorMsg: "No results found" });
    }

    const seenUserIDs = new Set();
    const messages = [];
    const users = [];

    results.forEach((r) => {
      const otherUser = r.senderID === userID ? r.receiver : r.sender;

      if (!seenUserIDs.has(otherUser.id)) {
        seenUserIDs.add(otherUser.id);
        users.push({
          id: otherUser.id,
          name: otherUser.name,
          username: otherUser.username,
          pfp: otherUser.profile.pfp,
        });
      }

      messages.push(r);
    });

    return res.status(200).json({ messages, users });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function dmUserSearch(req, res) {
  try {
    const { query } = req.query;

    const userSearchRes = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
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
      },
    });

    console.log("DM user search results:", userSearchRes);

    if (!userSearchRes || userSearchRes.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no user with that name" });
    }

    return res.status(200).json({ userSearchRes });
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

    const { name, username, email } = req.body;
    const pfp = req.file ? req.file.path : null;

    const updateData = { name, username, email };
    if (pfp) updateData.pfp = pfp;

    await prisma.profile.update({
      where: { user: userID },
      update: updateData,
    });

    await prisma.user.update({
      where: { id: userID },
      data: updateData,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
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
                pfp: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
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
    });

    if (!queryRes) {
      console.log("noqueryres");
      return res.status(403).json({ none: "no messages" });
    }

    queryRes.forEach((msg) => {
      const otherUser =
        msg.receiverID === thisUsersID ? msg.sender : msg.receiver;

      if (!seenUserIDs.has(otherUser.id)) {
        seenUserIDs.add(otherUser.id);
        noDupesList.push({
          id: otherUser.id,
          username: otherUser.username,
          name: otherUser.name,
          pfp: otherUser.profile.pfp,
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

    const queryRes = await prisma.msgs.findMany({
      where: {
        OR: [
          {
            senderID: thisUsersID,
            receiverID: withThisUSER,
            deletedBySender: false,
          },
          {
            senderID: withThisUSER,
            receiverID: thisUsersID,
            deletedByReceiver: false,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            profile: {
              select: {
                pfp: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
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
    });

    const otherUser = await prisma.user.findUnique({
      where: {
        id: withThisUSER,
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
      },
    });

    return res.status(200).json({ one2one: queryRes, otherUser });
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

    await prisma.msgs.create({
      data: {
        senderID: thisUsersID,
        receiverID: sendTo,
        message: msg,
        image: files.length > 0 ? files[0] : null,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function deleteMsg(req, res) {
  try {
    const { id } = req.user;
    const { deleteThisMsgID } = req.body;

    const thisUsersID = Number(id);
    const deleteThisMsg = Number(deleteThisMsgID);

    const isMsgOtherUsers = await prisma.msgs.findUnique({
      where: {
        id: deleteThisMsg,
      },
      select: {
        senderID: true,
        receiverID: true,
      },
    });

    const isCurrentUserSender = isMsgOtherUsers.senderID === thisUsersID;

    if (isCurrentUserSender) {
      await prisma.msgs.update({
        where: {
          id: deleteThisMsg,
          senderID: thisUsersID,
        },
        data: {
          deletedBySender: true,
        },
      });
    } else {
      await prisma.msgs.update({
        where: {
          id: deleteThisMsg,
          receiverID: thisUsersID,
        },
        data: {
          deletedByReceiver: true,
        },
      });
    }

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
        msg: body || "",
        img: files.length > 0 ? files[0] : null,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Post creation error:", error);
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
    const { postId } = req.body;
    const uID = req.user.id;

    const userID = Number(uID);
    const postID = Number(postId);

    const existingRepost = await prisma.reposts.findUnique({
      where: {
        postID_repostedBy: {
          postID: postID,
          repostedBy: userID,
        },
      },
    });

    if (existingRepost) {
      await prisma.reposts.delete({
        where: {
          postID_repostedBy: {
            postID: postID,
            repostedBy: userID,
          },
        },
      });
    } else {
      await prisma.reposts.create({
        data: {
          postID: postID,
          repostedBy: userID,
        },
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function like(req, res) {
  try {
    const post = req.body.postId;
    const uID = req.user.id;

    const userID = Number(uID);
    const postID = Number(post);

    const isThereAPost = await prisma.posts.findUnique({
      where: {
        id: postID,
      },
    });

    if (!isThereAPost) {
      return res.status(403).json({ success: false });
    }

    const existingLike = await prisma.likes.findFirst({
      where: {
        postID: postID,
        idOfLiker: userID,
      },
    });

    if (existingLike) {
      await prisma.likes.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.likes.create({
        data: {
          postID: postID,
          idOfLiker: userID,
        },
      });
    }

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

    const commentBody = req.body.commentBody;

    await prisma.posts.create({
      data: {
        madeBy: userID,
        msg: commentBody,
        commentOnPostID: postID,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function followHandler(req, res) {
  try {
    const id = req.user.id;
    const { thisID } = req.params;

    const userID = Number(id);
    const otherUserID = Number(thisID);

    const isUserFollowingOtherUser = await prisma.follow.findUnique({
      where: {
        followerID_followingID: {
          followerID: userID,
          followingID: otherUserID,
        },
      },
    });

    if (isUserFollowingOtherUser) {
      await prisma.follow.delete({
        where: {
          followerID_followingID: {
            followerID: userID,
            followingID: otherUserID,
          },
        },
      });
      return res.status(200).json({ userUnfollowed: true });
    }

    if (!isUserFollowingOtherUser) {
      await prisma.follow.create({
        data: {
          followerID: userID,
          followingID: otherUserID,
        },
      });
      return res.status(200).json({ userFollowed: true });
    }
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function blockHandler(req, res) {
  try {
    const id = req.user.id;
    const { thisID } = req.params;

    const userID = Number(id);
    const otherUserID = Number(thisID);

    const isUserBlockingOtherUser = await prisma.blocked.findUnique({
      where: {
        blockerID_blockedID: {
          blockerID: userID,
          blockedID: otherUserID,
        },
      },
    });

    const followRelation = await prisma.follow.findMany({
      where: {
        OR: [
          { followerID: userID, followingID: otherUserID },
          { followerID: otherUserID, followingID: userID },
        ],
      },
    });

    if (isUserBlockingOtherUser) {
      await prisma.blocked.delete({
        where: {
          blockerID_blockedID: {
            blockerID: userID,
            blockedID: otherUserID,
          },
        },
      });

      return res.status(200).json({ userUnblocked: true });
    }

    if (!isUserBlockingOtherUser) {
      await prisma.blocked.create({
        data: {
          blockerID: userID,
          blockedID: otherUserID,
        },
      });

      if (followRelation) {
        await prisma.follow.deleteMany({
          where: {
            OR: [
              { followerID: userID, followingID: otherUserID },
              { followerID: otherUserID, followingID: userID },
            ],
          },
        });
      }

      return res.status(200).json({ userBlocked: true });
    }
  } catch (error) {
    return res.status(500).json({ errorMsg: "Internal server error :^(" });
  }
}

async function checkBlockStatus(req, res) {
  try {
    const { otherUserID } = req.body;
    const { id } = req.user;

    const otherUser = Number(otherUserID);
    const thisUsersID = Number(id);

    const blockExists = await prisma.blocked.findFirst({
      where: {
        OR: [
          { blockerID: thisUsersID, blockedID: otherUser },
          { blockerID: otherUser, blockedID: thisUsersID },
        ],
      },
    });

    if (blockExists) {
      return res.status(200).json({ isBlocked: true });
    }

    return res.status(200).json({ isBlocked: false });
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

module.exports = {
  signup,

  sendIMGS,

  forYouFeed,
  followingFeed,
  getNavData,
  viewProfile,

  getPost,
  search,
  dmMsgSearch,
  dmUserSearch,
  settings,
  updateProfileSettings,

  followHandler,
  blockHandler,

  like,
  repost,
  comment,
  post,
  deletePost,

  dms,
  one2oneDMS,
  sendMsg,
  deleteMsg,
  checkBlockStatus,

  getBlockedUsers,
};
