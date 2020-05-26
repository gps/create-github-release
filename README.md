# Create GitHub Release

A GitHub Action that creates a release with artifacts.

Example usage:

```yml
      - name: Create release
        uses: gps/create-github-release@master
        with:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAG_NAME: v${{steps.next_version.outputs.NEXT_BUILD_VERSION}}
          ARTIFACTS: |
            dist/gen_migrations ==> gen_migrations
            dist/gen_models ==> gen_models
            dist/alembic ==> alembic
```
