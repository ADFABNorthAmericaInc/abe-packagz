'use strict'
var path = require('path')
var tar = require('tar-fs')
var fs = require('fs')
var glob = require('glob')

var hooks = {
	afterPublish: function (result, postPath, abe) {
		if (abe.config["abe-packagz"].active){
			const documentPath = path.join(abe.config.root, abe.config.publish.url)
			const fileName = path.basename(result.abe_meta.publish.abeUrl)
			const packageDate = Math.floor(new Date())
			const destPost = path.join(abe.config["abe-packagz"].destinationPath, abe.config["abe-packagz"].prefixHtml + packageDate + '.tar.gz')
			const destImage = path.join(abe.config["abe-packagz"].destinationPath, abe.config["abe-packagz"].prefixImages + packageDate + '.tar.gz')
			const template = result.abe_meta.template
			const templateContent = abe.cmsTemplates.template.getTemplate(template,result)
			const arImagesAbeTags = abe.cmsData.regex.getTagAbeWithType(templateContent,'image')

			if (abe.config["abe-packagz"].mergeAssets === true) {
				let arPostPath = []
				if (arImagesAbeTags.length !== 0){
					arImagesAbeTags.forEach(
						function(elt) {
							let key = abe.cmsData.regex.getAttr(elt,'key')
							if (key !== '' && result[key] !== ''){
								let keyResult = result[key].replace(path.extname(result[key]), '*' + path.extname(result[key]))
								if (keyResult.substring(0, 1) == "/") {
									keyResult = keyResult.substr(1)
								}
								let g = new glob.sync(keyResult, {cwd:documentPath})
								arPostPath = arPostPath.concat(g)
							}					
						}
					)
          arPostPath.push(fileName)
          fs.stat(documentPath, function (err, stats) {
            if(err) return console.log(err);
            tar.pack(documentPath, {
              entries: arPostPath
            }).pipe(fs.createWriteStream(destPost))	
          })
				}
			} else {
				let arImagesPath = []
				if (arImagesAbeTags.length !== 0){
					arImagesAbeTags.forEach(
						function(elt) {
							let key = abe.cmsData.regex.getAttr(elt,'key')
							if (key !== '' && result[key] !== ''){
								let keyResult = result[key].replace(path.extname(result[key]), '*' + path.extname(result[key]))
								if (keyResult.substring(0, 1) == "/") {
									keyResult = keyResult.substr(1)
								}
								let g = new glob.sync(keyResult, {cwd:documentPath})
								arImagesPath = arImagesPath.concat(g)
							}					
						}
					)
					if (arImagesPath.length !== 0){
            fs.stat(documentPath, function (err, stats) {
              if(err) return console.log(err);
              tar.pack(documentPath, {
                entries: arImagesPath 
              }).pipe(fs.createWriteStream(destImage))
            })
					}	
				}

        fs.stat(destPost, function (err, stats) {
          if(err) return console.log(err);
          tar.pack(documentPath, {
            entries: [fileName] 
          }).pipe(fs.createWriteStream(destPost))
        })
			}
		}			
	}
}

exports.default = hooks;
