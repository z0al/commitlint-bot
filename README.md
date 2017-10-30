# commitlint-bot

<p align="center">
  <img src="docs/robot.svg" width="256" alt="commitlint-bot logo" />
</p>

> Built with [probot](https://github.com/probot/probot) framework

A GitHub App that runs [commitlint](https://github.com/marionebl/commitlint) over all commits of new or edited pull requests
and sets an appropriate status check.

## Usage

1. Browse to [GitHub Apps - commitlint-bot][apps]
2. Accept the permissions
3. Allow access to repositories

On the next pull request, a status check from `commitlint-bot` will appear:

![status-check-screenshot][]

For best results, enable branch protection (in the repository's settings) and require the `commitlint-bot` status check to pass before merging:

![branch-protection-screenshot][]

[apps]: https://github.com/apps/commitlint-bot
[status-check-screenshot]: docs/status.png
[branch-protection-screenshot]: docs/setting.png

## Todo

- [ ] Add tests
- [ ] Support `.commitlintrc.json` and `.commitlintrc.yml` files
- [ ] Add here ? open an [issue](https://github.com/ahmed-taj/commitlint-bot/issues/new)

## Development

1. Setup the repo:

```shell
git clone https://github.com/ahmed-taj/commitlint-bot.git
cd commitlint-bot
npm install
```

2. Create your own [GitHub app][]
3. Store the private key as `private-key.pem` in the repo
4. Start the app with `APP_ID=1234 npm start` where `1234` is your GitHub app's ID
5. Update your GitHub app's Webhook URL to your localtunnel.me URL

[GitHub app]: https://probot.github.io/docs/development/#configure-a-github-app


## Credits

Robot designed by [Freepik](https://www.freepik.com/free-vector/fun-pack-of-robots-avatars_1258314.htm).

## Like it?

Give it a star(:star:) :point_up_2:

## License

MIT © [Ahmed T. Ali](https://github.com/ahmed-taj)
