$(document).ready(function(){
    
    // START: CATALOGUE

    /**$(".item").hover(function () {
        $(this).children('.card-body').children('.itemFooter').children(".itemDescription").css("display", "none");
        $(this).children('.card-body').children('.itemFooter').children(".addToCart").css("display", "block");
    }, function () {
        $(this).children('.card-body').children('.itemFooter').children(".itemDescription").css("display", "block");
        $(this).children('.card-body').children('.itemFooter').children(".addToCart").css("display", "none");
    })**/

    var prevItem = null;
    class cartItem {
        constructor(productno, name, price, quantity) {
            this.productno = productno;
            this.name = name;
            this.price = price;
            this.quantity = quantity;
        }
    }
    var shoppingCartItems = [];

    $(".itemPicture").click(function () {
        currItem = $(this).parent().parent().parent();
        currItem.children('.card-body').children('.itemFooter').children(".itemDescription").css("display", "none");
        currItem.children('.card-body').children('.itemFooter').children(".addToCart").css("display", "block");

        if(prevItem != null)
        {
            prevItem.children('.card-body').children('.itemFooter').children(".itemDescription").css("display", "block");
            prevItem.children('.card-body').children('.itemFooter').children(".addToCart").css("display", "none");
        }

        if (prevItem != null && prevItem.data('value') == currItem.data('value'))
        {
            prevItem = null;
        } else
        {
            prevItem = currItem;
        }
    });

    function changeShoppingCart(productno, name, price, newQuantity)
    {
        var item = shoppingCartItems.find(item => productno == item.productno);
        if (item != null && newQuantity != 0)
        {
            // If its part of the shopping cart, update cart
            item.quantity = newQuantity;
        }
        else if (item != null && newQuantity == 0)
        {
            // If its part of the shopping cart but new quantity is 0, delete from cart
            shoppingCartItems.splice(shoppingCartItems.findIndex(item => productno == item.productno))
        }
        else
        {
            // Item doesn't exist, push to cart
            var newItem = new cartItem(productno, name, price, newQuantity);
            shoppingCartItems.push(newItem);
        }

        $('#shoppingCartItems').empty();

        var cartTotalPrice = 0;

        for(x of shoppingCartItems)
        {
            var itemTotalPrice = x.price*x.quantity;
            var htmlstring = 
            `
            <div class='d-flex itemShoppingCart container rounded border border-dark bg-white px-1 my-2'>
                <div class='col-7 text-left'>
                    <div class='row'>
                        ${x.name}
                    </div>
                    <div class='row'>
                        ${x.price} X ${x.quantity}
                    </div>
                </div>
                <div class='col-5 d-flex justify-content-end float-right text-right itemPrice'>${itemTotalPrice}</div>
            </div>
            `;

            $('#shoppingCartItems').append(htmlstring);
            cartTotalPrice += itemTotalPrice;
        }

        $('.totalPrice').html(cartTotalPrice.toFixed(2));
        
    }

    $(".add").click(function ()
    {
        var val = parseInt($(this).parent().siblings("input").val());
        var productno = $(this).parents().filter(".item").data('value');
        var name = $(this).parents().filter(".addToCart").siblings(".itemDescription").children(".itemName").html();
        var price = parseInt($(this).parents().filter(".addToCart").siblings(".itemDescription").children(".itemPrice").data("value"));
        val++;

        changeShoppingCart(productno, name, price, val);

        $(this).parent().siblings("input").val(val);
        console.log(productno, shoppingCartItems)
    });

    $(".subtract").click(function ()
    {
        var val = parseInt($(this).parent().siblings("input").val());
        if(val > 0)
        {
            var productno = $(this).parents().filter(".item").data('value');
            var name = $(this).parents().filter(".addToCart").siblings(".itemDescription").children(".itemName").html();
            var price = parseInt($(this).parents().filter(".addToCart").siblings(".itemDescription").children(".itemPrice").data("value"));
            val--;

            changeShoppingCart(productno, name, price, val);

            $(this).parent().siblings("input").val(val);
            console.log(productno, shoppingCartItems);
        }
    });

    $(".quantity-field").change(function ()
    {
        var val = parseInt($(this).val());
        if(val > 0)
        {
            var productno = $(this).parents().filter(".item").data('value');
            var name = $(this).parents().filter(".addToCart").siblings(".itemDescription").children(".itemName").html();
            var price = parseInt($(this).parents().filter(".addToCart").siblings(".itemDescription").children(".itemPrice").data("value"));

            changeShoppingCart(productno, name, price, val);

            $(this).parent().siblings("input").val(val);
            console.log(productno, shoppingCartItems)
        } 
        else
        {
            $(this).parent().siblings("input").val(0);
            console.log(productno, shoppingCartItems);
        }
    });

    // END: CATALOGUE
});

