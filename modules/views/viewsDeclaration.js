
const views = [
    { html:'/public/views/',fileName:'basicLoginForm.html',serviceName:'/view/basic-login', serviceCore:'basicLogin' },
    { html:'/public/views/',fileName:'basicSignUpForm.html',serviceName:'/view/basic-signUp', serviceCore:'basicSignUp' },
    { html:'/public/views/',fileName:'init.html',serviceName:'/view/init', serviceCore:'init' },
    { html:'/public/views/',fileName:'startIndex.html',serviceName:'/view/basic-start', serviceCore:'basicStart' },
    { html:'/public/views/',fileName:'forgottenPasswordStepOne.html',serviceName:'/view/change-password-step-one', serviceCore:'forgottenPasswordStepOne' },
    { html:'/public/views/',fileName:'forgottenPasswordStepTwo.html',serviceName:'/view/change-password-step-two', serviceCore:'forgottenPasswordStepTwo' }

]

const incrementalViews = [
    { html:'/public/incrementalViews/',fileName:'pageOne.html',serviceName:'/incrementalViews/pageOne', serviceCore:'basicStart' },
    { html:'/public/incrementalViews/',fileName:'pageTwo_One.html',serviceName:'/incrementalViews/pageTwo/pageTwo_One', serviceCore:'forgottenPasswordStepOne' },
    { html:'/public/incrementalViews/',fileName:'pageTwo_Two.html',serviceName:'/incrementalViews/pageTwo/pageTwo_Two', serviceCore:'forgottenPasswordStepTwo' }

]



const ViewsRegister = [...views,...incrementalViews]

module.exports = ViewsRegister