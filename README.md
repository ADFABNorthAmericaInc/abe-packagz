# abe-packagz
This abe plugin packages each published post in targz format

##Introduction
This plugin will create a tar.gz package for each post.

## Configuration
Configure the abe-packagz parameters in your abe.json file.

```
"abe-packagz": {
"active": true,
"prefixHtml": "my_prefix_html_",
"prefixImages": "my_prefix_images_",
"destinationPath": "/my/absolute/path/to",
"mergeAssets": true
},
```
You can deactivate this plugin by setting "active" to false
## How it works

### On your Abe CMS
Every time you publish a content, abe-packagz will create a tar.gz package in the destinationPath.

You can choose between 1 or 2 packages :

- 1 package.tar.gz (Post + Assets) - mergeAssets === true
- 2 packages.tar.gz (1 for Post + 1 for assets) - mergeAssets === false

