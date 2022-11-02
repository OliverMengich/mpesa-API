module.exports = async function getOAuthToken(req,res,next){
    let consumer_key = process.env.CONSUMER_KEY;
    let consumer_secret = process.env.CONSUMER_SECRET;

    let url = process.env.OAUTH_TOKEN_URL;

    //form a buffer of the consumer key and secret
    let buffer = new Buffer.from(consumer_key+":"+consumer_secret);

    let auth = `Basic ${buffer.toString('base64')}`;

    try{

        let {data} = await axios.get(url,{
            "headers":{
                "Authorization":auth
            }
        });

        req.token = data['access_token'];

        return next();

    }catch(err){

        return res.send({
            success:false,
            message:err['response']['statusText']
        });
    }
};