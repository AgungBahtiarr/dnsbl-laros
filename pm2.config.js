module.exports = {
  name: "dnsbl-laros",
  script: "index.ts",
  interpreter: "bun",
  env: {
    PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
  },
};
