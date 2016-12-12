'use strict'
var path = require('path')
var tar = require('tar-fs')
var fs = require('fs')

var hooks = {
	afterPublish: function (result, postPath, abe) {
		if (abe.config["abe-packagz"].active){
			const documentPath = path.join(abe.config.root, abe.config.publish.url)
			const fileName = path.basename(result.abe_meta.publish.abeUrl)
			const packageDate = Math.floor(new Date() / 1000)
			const destPost = path.join(abe.config["abe-packagz"].destinationPath, abe.config["abe-packagz"].prefixHtml + packageDate + '.tar.gz')
			const destImage = path.join(abe.config["abe-packagz"].destinationPath, abe.config["abe-packagz"].prefixImages + packageDate + '.tar.gz')
			const template = result.abe_meta.template
			const templateContent = abe.cmsTemplates.template.getTemplate(template)
			const arImagesAbeTags = abe.cmsData.regex.getTagAbeWithType(templateContent,'image')


			if (abe.config["abe-packagz"].mergeAssets === true) {
				let arPostPath = []
				if (arImagesAbeTags.length !== 0){
					arImagesAbeTags.forEach(
						function(elt) {
							let key = abe.cmsData.regex.getAttr(elt,'key')
							if (key !== '' && result[key] !== ''){
								arPostPath.push(result[key])
							}					
						}
					)
					arPostPath.push(fileName)
					tar.pack(documentPath, {
					  entries: arPostPath
					}).pipe(fs.createWriteStream(destPost))	
				}
			} else {
				let arImagesPath = []
				if (arImagesAbeTags.length !== 0){
					arImagesAbeTags.forEach(
						function(elt) {
							let key = abe.cmsData.regex.getAttr(elt,'key')
							if (key !== '' && result[key] !== ''){
								arImagesPath.push(result[key])
							}					
						}
					)
					if (arImagesPath.length !== 0){
						tar.pack(documentPath, {
						  entries: arImagesPath 
						}).pipe(fs.createWriteStream(destImage))
					}	
				}

				tar.pack(documentPath, {
				  entries: [fileName] 
				}).pipe(fs.createWriteStream(destPost))
			}
		}			
	}
}

exports.default = hooks;
