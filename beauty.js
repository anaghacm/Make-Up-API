function searchItem() {
    brand = inputBrand.value;
    product = inputProduct.value;

    // let selectedtags='';
    // var markedCheckbox = document.getElementsByName('tag');
    // for (var checkbox of markedCheckbox) {
    //     if (checkbox.checked)
    //         selectedtags+=checkbox.value+'+';  
    // }
    // selectedtags=selectedtags.slice(0,-1);
    // alert(selectedtags)
    data = {
        brand, product
    }

    if (brand == '-- Select --' && product == '-- Select --') {
        alert('Kindly select your item');
    }
    else {
        localStorage.setItem('product', JSON.stringify(data));
        window.location.href = './displayproducts.html';
    }

}
function myFunction() {
    details = JSON.parse(localStorage.getItem('product'));
    brand = details.brand;
    product = details.product;

    tag = JSON.parse(localStorage.getItem('tagname'));
    // console.log(details.selectedtags);


    if (tag == null) {

        if (brand == '-- Select --' && product != '-- Select --') {
            producttype.innerHTML = `PRODUCT : ${product}`;
            fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${product}`)
                .then(res => res.json())
                .then(data => displayData(data))
                .catch(error => { alert(error) })
        }
        else if (brand != '-- Select --' && product == '-- Select --') {
            producttype.innerHTML = `BRAND : ${brand}`;
            fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`)
                .then(res => res.json())
                .then(data => displayData(data))
                .catch(error => { alert(error) })
        }

        else {
            producttype.innerHTML = `PRODUCT : ${product}`;
            fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}&product_type=${product}`)
                .then(res => res.json())
                .then(data => displayData(data))
                .catch(error => { alert(error) })
        }

    }
    else {
        producttype.innerHTML = `Tag : ${tag.tagname}`;
        fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?product_tags=${tag.tagname}`)
            .then(res => res.json())
            .then(data => displayData(data))
            .catch(error => { alert(error) })
    }
}

function displayData(data) {
    localStorage.removeItem('productdetail');

    if (data.length == 0) {
        htmldata = `<p  style="color: rgb(89, 13, 34); text-align:center; font-family: 'Abel', sans-serif; font-size:26px; font-weight:bolder; margin:auto;">Oopz..! No products available with given specification</p>`
        contnt.innerHTML += htmldata;

    }
    else {
        for (let pdt of data) {
            pbrand = pdt.brand;
            pname = pdt.name;
            if (pdt.category == null)
                category = 'Uncategorized';
            else
                category = pdt.category;
            price = pdt.price;
            imglink = pdt.api_featured_image;
            htmldata = `<a href="#" onclick="detailsPage('${pbrand}','${pdt.product_type}',${pdt.id})"><div class="col">
          <div class="card">
            <img src=${imglink} class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${pname}</h5>
              <p class="card-text"><b>Brand :</b> ${pbrand}</p>
              <p class="card-text"><b>Category :</b> ${category}</p>
              <p class="card-text"><b>Price :</b> $${price}</p>

            </div>
          </div>
        </div>
            </div></a>`
            contnt.innerHTML += htmldata;

        }
    }

}

function clearStorage() {
    localStorage.clear();
}

function detailsPage(brand, product, id) {
    data = {
        brand, product, id
    }
    localStorage.setItem('productdetail', JSON.stringify(data));
    window.location.href = './details.html';
}

function productDetails() {

    details = JSON.parse(localStorage.getItem('productdetail'));
    brand = details.brand;
    product = details.product;
    console.log(details)

    fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}&product_type=${product}`)
        .then(res => res.json())
        .then(data => displayDetails(data))
        .catch(error => { alert(error) })
}

function displayDetails(data) {
    details = JSON.parse(localStorage.getItem('productdetail'));
    // console.log(data)
    for (let pdt of data) {
        if (details.id == pdt.id) {
            // console.log(pdt);
            pbrand = pdt.brand;
            pname = pdt.name;
            category = pdt.category;
            price = pdt.price;
            imglink = pdt.api_featured_image;
            // console.log(pdt.product_link)
            if (pdt.rating == null)
                rating = 'Unrated';
            else
                rating = pdt.rating;

            pdtname.innerHTML = `${pname}`;

            htmldata = `<div class="card" id="carddet" style="color: rgb(89, 13, 34);">
            <img src=${imglink} class="card-img-top" alt="...">
            <div class="card-body">
              <p class="card-text fw-bold">Product : ${pdt.product_type}</p>
              <p class="card-text fw-bold">Brand : ${pbrand}</p>
              <p class="card-text fw-bold">Star rating : ${rating}</p>
              <p class="card-text fw-bold">Price : $${price}</p>
              <button onclick="window.location.href='${pdt.product_link}'" id="buynow">Buy Now</button>
            </div>
          </div>
        </div>`
            contnt1.innerHTML += htmldata;

            if (pdt.product_colors.length > 0) {
                for (let clrs of pdt.product_colors) {
                    colors.innerHTML += `<label class=" me-2 ms-5 mt-4" style=" width: 20px; height:20px; border-radius: 50%; background-color: ${clrs.hex_value};"></label><label id="clrname" style="height: 20px; width: 200px; color: rgb(89, 13, 34);">${clrs.colour_name}</label>`
                }
                colors.innerHTML += ` <div class="row my-5">
                <hr style="height: 3px; color: rgb(89, 13, 34);">
            </div>`
            }
            description.innerHTML = `<b>Description : </b>${pdt.description}`;

            for (let tag of pdt.tag_list) {
                tags.innerHTML += `<a href="#" onclick="displaybyTags('${tag}')"' style="text-decoration:underline !important" data-toggle="tooltip" title="Get products with tag">${tag}</a><br>`
            }
        }
    }
}

function displaybyTags(tagname) {
    // console.log(tagname)
    tag = { tagname }
    localStorage.setItem('tagname', JSON.stringify(tag));
    window.location.href = './displayproducts.html';
}