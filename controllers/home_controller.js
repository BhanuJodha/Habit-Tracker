exports.home = (req, res)=>{
    res.render("home", {
        title: "Home Page",
        change_view: "/details"
    });
}