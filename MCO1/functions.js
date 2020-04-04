$(document).ready(function(){

    var num = $("#number").val();
    var add1 = $("#add1").val();
    var add2 = $("#add2").val();

    $("#btnEdit").click(function(){
        $(this).hide();
        $("#number").prop("readonly", false);
        $("#add1").prop("readonly", false);
        $("#add2").prop("readonly", false);
        $("#btnCancel").css("display","block");
        $("#btnConfirm").css("display","block");
    });

    $("#btnCancel").click(function(){
        $("#btnCancel").css("display","none");
        $("#btnConfirm").css("display","none");
        $("#btnEdit").show();
        $("#number").val(num);
        $("#add1").val(add1);
        $("#add2").val(add2);
        $("#error").text("");
    });

    $("#btnConfirm").click(function(){

        var num = $("#number").val();
        console.log(num);
        var regex = /^(09)\d{9}$/;
        if( regex.test(num) == false )
        {
            $("#error").text("Must be in 11-digit form: 09XXXXXXXXX");
        }
        else
        {
            $("#error").text("");
            $("#btnCancel").css("display","none");
            $("#btnConfirm").css("display","none");
            $("#btnEdit").show();
        }
        
    });
});

