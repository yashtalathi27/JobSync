const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
// const { default: FreelancerSignup } = require("../../frontend/vite-project/src/pages/SignupFreeLancer");

const freelancerModel = require("../Model/freelancerSchema");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "jobsync-2407b",
    private_key_id: "fabc0d1a790df3fadd5f7f14ec79cd8baf851752",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDd9WXYNDzIGZrk\nt2lQ34kXWksDVV/OnjOffwDv9SuqND3j9ZN7afjzSxH/1D5p87QFWm8M7EoWzrPP\nqR4Z0cei00eAnvaD0xaEfsrBQYRnsPxJQV4YH28gbt9mhM80YRIIJHhM33zmblbI\nLU/0P/TsjJnJlQR4Tls7vOTAnTJ/zFfnxbnj4bgWHOsPQnWHSSnlhf5SO+bzpPjx\nthWzp3+lPFs0E0Q/4EC4J+jh181wEKj4Vnw8FZodJax2MgaVuLPNosrBuyelcgvD\ny32akCbYKMgEMA03p5wwEUaWb6KVCs63Cc11ReFUM1aRv/9LcdOt+HhC7oQPQf0y\nwJ7m9R/lAgMBAAECggEAB6w3gJFRtpMYBScH93k6unlvFWbqoHBclXtk82aUw1X5\n+7reBcqkhfiG30Kdg7kedH7rTtWOPBqaIagVd8wGLC1EkAAuwmDWKu9dH/AdXR5D\nol6lm4zeoQ7kHx2hMgzW/DwSgonJPgf7bQEP/gAF/fVgTZUeqe//fGGrwLLOb5d2\nx5VeHmaCuAnC15mcCrhVtv6WcJhWU7zdju8Akg1vEFLUo+u5OILPoH7+5XhOcNlK\nbecEmaLGcl9EkGKQnccDpMF8AY8VFtslGQ/yXLlz/RIBnublF4rLxSYRt35JeLQY\nAJ28zNJ9IKAkfKDp5YMxnxOptTut4WipvOGPHPIFswKBgQD1ljnKNgkA/dghrGh3\nQgHgMIfQv4DPtxKKmTsxaYNa0gXSYJ8MXu01/dvQX+s6vk54Wafl33uhGEQRds8+\nKoBnaPftktu4NrWiqRqVRrG3hhcssF+K7liCWCxr7H76FjjVj7qIwmFgKeYA/bvm\ntR4T36v+nlBv255EPV8Mxrv0SwKBgQDnXrHEpw1NjEPIf3IhfTohf59985iw9rd2\nG9lb1jQQSV2i5oJ/J6B69TZpebVwfpml8qV9mPUKdfgn8m7RMbBBkj+KodbxjuoR\nR8XSKRAhZ6b4ZIlgZMfOMk/ESGvU2UTQVkpOTAfSkX8ZCVIQEGmn7rKJs2BsyILh\nLmmJtPi+jwKBgFrO7pV3v4KPWmCxKHuYe6sTJtUoSpADyKZZHIsb0cc+S4rL0WO4\nogvJz4LQROGWxts3g567MTKTD3BJtz3sZ0hVhv9gwz/tcuIvlzXFSydqPJ14pgtw\nMGgaBGrvqs/8cY1+NOImxezR8UtChz06kWGV3joq/eEumunuq3vE7HDbAoGBALTb\ne8BKCQcOVsn6fZ+aAP/AgE73ROtH3/8uI8k69rWoc85ru6RjuHmFBsSKQ/8spzRm\nKWC1WQ6VSqcHRgK2gZ2wEYVvntJyMZvSa9stCBPkr0tJY217Ogh/oYTAS7I1KCpm\n2Wy81/yMiTpr47705XJFD0C+e+htEImvOwZO9YYXAoGBAK44bxLEN8Bbg3eZ3J0u\nWVGxnmv1rT/zHYZwECSElQsGkZEvic4/iB4jdTA9NPm0B4tOEBxDZCAZLbQ2h619\n5kVaWibNjQgYx8Bk/aeOmx6mevb060l582GK7Q/si/f7jdvPJ4uWu5USopP73duG\nHhpYZeAaXTXW25tcJ3Pb4uSX\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-fbsvc@jobsync-2407b.iam.gserviceaccount.com",
    client_id: "107698080682052403327",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40jobsync-2407b.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }),
});

async function googleAuth(req, res) {
  try {
    const { accessToken } = req.body;
    // console.log(acessToken);

    const response = await getAuth().verifyIdToken(accessToken);
    console.log("res:", response);

    const {  email } = response;
    
    let user = await freelancerModel.findOne({ email });

    if (user) {
      return res.json({
        message: "User already registered",
        success: true,
        freelancer: {
          id: user.freelancerId || user._id,
          name: user.name,
          email: user.email
        }
    });
    }
    
    let newUser = await freelancerModel.create({
      email,
      password: "googleAuth",
    });

    // const token = await generateJWT({ email: newUser.email, id: newUser._id });
    return res.json({
      message: "User registered in successfully",
      success: true,
      freelancer: {
        id: newUser.freelancerId || newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Error in Google Auth:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  googleAuth,
};
