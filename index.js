module.exports = (app) => {
  const adminUsernames = [];

  app.log("Yay, the bot was loaded!");
  app.on("issues.opened", async (context) => {
    const issue = context.payload.issue;
    if (adminUsernames.includes(issue.user.login)) {
      app.log(
        `Ignoring new issue ${issue.id} created by admin ${issue.user.login}`
      );
      return;
    }
    if (!issue.closed_at) {
      app.log(`Issue Opened: ${issue.id}`);

      const comment = context.issue({
        body: `Thanks @${issue.user.login}, for raising the issue!  🙌
  One of our team mates will revert on this soon. ✅`,
      });

      return context.github.issues.createComment(comment);
    }
  });

  app.on("pull_request.opened", async (context) => {
    const pr = context.payload.pull_request;
    if (adminUsernames.includes(pr.user.login)) {
      app.log(`Ignoring new pr ${pr.id} opened by admin ${pr.user.login}`);
      return;
    }
    if (!pr.closed_at) {
      app.log(`Pull Request Opened: ${pr.id}`);

      const comment = context.issue({
        body: `Thanks @${pr.user.login}, for opening the pull request!  🙌
  One of our team-mates will review the pull request soon. ✅`,
      });

      return context.github.issues.createComment(comment);
    }
  });

  app.on("pull_request.closed", async (context) => {
    const pr = context.payload.pull_request;
    if (adminUsernames.includes(pr.user.login)) {
      app.log(`Ignoring pr ${pr.id} closing by admin ${pr.user.login}`);
      return;
    }
    if (!!pr.merged_at) {
      app.log(`Pull Request Closed: ${pr.id}`);

      const comment = context.issue({
        body: `Congratualtions @${pr.user.login}, your pull request is merged! 🎉 
  Thanks for your contributions.🙌`,
      });

      return context.github.issues.createComment(comment);
    }
  });
};