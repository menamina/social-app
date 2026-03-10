// this is what will fetch api to view other users profiles as well

import { useState, useEffect } from "react";
import { OutletContext, useNavigate } from "react-router-dom";

function Feed() {
  const { forYouFeed, setForYouFeed, forYouFeedErr, setForYouFeedErr } =
    OutletContext();

  async function refreshForYouFeed() {}

  async function refreshForFollowingFeed() {}
}

export default Feed;
