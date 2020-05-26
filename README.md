# Create GitHub Release

A GitHub Action that creates a release with artifacts.

## Inputs

### `gh_token`

The GitHub token used to authenticate with GitHub.

**Required**

### `tag_name`

Tag name to associate artifacts with.

**Required**

### `artifacts`

Artifacts to associate with release.

Each artifact should be on its own line. See example for how to point to and name artifacts.

**Required**

## Example Usage

```yml
- name: Create release
  uses: gps/create-github-release@master
  with:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    TAG_NAME: "v0.0.1"
    ARTIFACTS: |
      dist/foo ==> foo
      dist/bar ==> bar
```
