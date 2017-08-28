const assert = require("power-assert");
const GitLab = require("../src/gitlab.js");

describe("GitLab", () => {
  describe("#apiVersion()", () => {
    context("api_path is empty", () => {
      it("should return 0", () => {
        const gitlab = new GitLab();
        assert(gitlab.apiVersion == 0);
      });
    });

    context("api_path is not api url", () => {
      it("should return 0", () => {
        const gitlab = new GitLab({api_path: "https://gitlab.com/"});
        assert(gitlab.apiVersion == 0);
      });
    });

    context("api_path ends with /v3/", () => {
      it("should return 3", () => {
        const gitlab = new GitLab({api_path: "https://gitlab.com/api/v3/"});
        assert(gitlab.apiVersion == 3);
      });
    });

    context("api_path ends with /v4/", () => {
      it("should return 4", () => {
        const gitlab = new GitLab({api_path: "https://gitlab.com/api/v4/"});
        assert(gitlab.apiVersion == 4);
      });
    });
  });
});
