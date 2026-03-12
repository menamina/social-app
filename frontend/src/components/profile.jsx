import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";

function Profile() {
  const { userProfile, setUserProfile, navUserData, setNavUserData } =
    useOutletContext();
  const [profileViewOption, setProfileViewOption] = useState("posts");

  function profileViewOpt(option) {
    if (option === "posts") setProfileViewOption("posts");
    if (option === "comments") setProfileViewOption("comments");
    if (option === "likes") setProfileViewOption("likes");
  }

  useEffect(() => {
    async function refetchUserData() {
      try {
        const res = await fetch(
          `http://localhost:5555/@${navUserData.username}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        setUserProfile(data.viewThisUserProfile);
      } catch (error) {
        return error;
        //  fix later
      }
    }
    refetchUserData;
  }, []);

  if (!userProfile) {
    return <div>loading..</div>;
  }

  return (
    <div>
      <div>Profile</div>
      <div>
        <div>
          <div>
            <div>
              <div>{userProfile.name}</div>
              <div>{userProfile.username}</div>
              <div>
                <div>{userProfile.followers.length}</div>
                <div>{userProfile.following.length}</div>
              </div>
            </div>
            <div>
              <div>
                <img src={`http://localhost:5555/pfpIMG/${userProfile.pfp}`} />
              </div>
              <div>
                <Link to="/settings">edit</Link>
              </div>
            </div>
          </div>
          <div>
            <div onClick={() => profileViewOpt("posts")}>Posts</div>
            <div onClick={() => profileViewOpt("comments")}>Comments</div>
            <div onClick={() => profileViewOpt("likes")}>Likes</div>
          </div>
          <div>
            {profileViewOpt === "posts"
              ? userProfile.posts.map((post) => {
                  <Link
                    to={`http://localhost:5555/@${post.username}/post/${post.id}`}
                    key={post.id}
                    className="postContainer"
                  >
                    <div className="postersPFP">
                      <Link to={`http://localhost:5555/@${post.username}`}>
                        <img src={`http://localhost:5555/pfpIMG/${post.pfp}`} />
                      </Link>
                    </div>
                    <div>
                      <div className="postInfo">
                        <div>{post.username}</div>
                        <div>{post.createdAt}</div>
                      </div>
                      <div className="postMsg">
                        <div>{post.msg}</div>
                      </div>
                      <div className="postImg">
                        {post.img ? (
                          <div>
                            <img
                              src={`http://localhost:5555/img/${post.img}`}
                            />
                          </div>
                        ) : null}
                      </div>
                      <div className="postOptions">
                        <div className="likes">
                          <div>
                            <img />
                          </div>
                          <div>{post.likes.length}</div>
                        </div>

                        <div className="comments">
                          <div>
                            <img />
                          </div>
                          <div>{post.comments.length}</div>
                        </div>

                        <div className="reposts">
                          <div>
                            <img />
                          </div>
                          <div>{post.reposts.length}</div>
                        </div>

                        <div className="share">
                          <div>
                            <img />
                          </div>
                          <div>Share</div>
                        </div>
                      </div>
                    </div>
                  </Link>;
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
