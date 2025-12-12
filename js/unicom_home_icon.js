let obj = JSON.parse($response.body);

if (obj.HomeFusion) {
    delete obj.HomeFusion.backGroundQuery;
    if (obj.HomeFusion.bottomLabel) {
        delete obj.HomeFusion.bottomLabel.bottomMallKey;
    }
}

$done({
    body: JSON.stringify(obj)
});
