const  Flickr = require('flickrapi');
const flickrOptions = {
  api_key: "13961738ab40be669def9a4f1be13560",
  secret: "03de436192076b73"
};

const getPhotos = (req,res)=> {
  const search = req.body.search
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    flickr.photos.search({
            tags: search,
            page: 1,
            per_page: 500
        },
        function(err, result) {
            if (result.stat === 'ok') {
                res.json('search', {
                    title: 'Search',
                    photos: result
                })
            }else {
              res.send({
                error: 'something wrong',
                err: err
              })
            }
        })
})
}


module.exports = {
  getPhotos
}