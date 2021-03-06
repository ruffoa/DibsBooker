function showAlert(header, message, success){
    html = "";
    if (!success){
        html += '<div class="alert alert-danger alert-dismissible fade show" role="alert">';
    }
    else
        html += '<div class="alert alert-success alert-dismissible fade show" role="alert">';

    html += '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
            '    <span aria-hidden="true">&times;</span>\n' +
            '  </button>';
    html += '<h4 class="alert-heading">'+header+'</h4>';
    html += '<p>'+message+'</p>';
    html += '</div>'
    $('#message_container').append(html);
}

function doModal(heading, formContent, success) {
    html =  '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>'+heading+'</h4>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += formContent;
    if(!success)
        html += '<video height="400" width="300" autoplay loop>\n' +
            '  <source src="video/carson-1.webm" type="video/webm">\n' +
            '  Your browser does not support the video tag.\n' +
            '</video>';

    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
    html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    $('body').append(html);
    jQuery.noConflict();
    $("#dynamicModal").modal();
    $("#dynamicModal").modal('show');

    $('#dynamicModal').on('hidden.bs.modal', function (e) {
        $(this).remove();
    });
}

document.addEventListener("DOMContentLoaded", function() {

    // JavaScript form validation

    var checkPassword = function(str)
    {
        // var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        var re = /^[a-zA-Z0-9-]+/;

        return re.test(str);
    };

    var checkForm = function(e)
    {
        if(this.pwd1.value != "" && this.pwd1.value == this.pwd2.value) {
            if(!checkPassword(this.pwd1.value)) {
                showAlert("The password you have entered is not valid!", "Passwords must be at least 6 characters long.", false);
                this.pwd1.focus();
                e.preventDefault();
                return;
            }
        } else {
            showAlert("Error: Passwords do not match.", "Please check that you've entered and confirmed your password", false);
            this.pwd1.focus();
            e.preventDefault();
            return;
        }
        // alert("Both username and password are VALID!");
    };

    var myForm = document.getElementById("signup_form");
    myForm.addEventListener("submit", checkForm, true);

    // HTML5 form validation

    var supports_input_validity = function()
    {
        var i = document.createElement("input");
        return "setCustomValidity" in i;
    }

    if(supports_input_validity()) {

        var pwd1Input = document.getElementById("pwd1");
        pwd1Input.setCustomValidity(pwd1Input.title);

        var pwd2Input = document.getElementById("pwd2");

        // input key handlers

        pwd1Input.addEventListener("keyup", function(e) {
            this.setCustomValidity(this.validity.patternMismatch ? pwd1Input.title : "");
            if(this.checkValidity()) {
                pwd2Input.pattern = RegExp.escape(this.value);
                pwd2Input.setCustomValidity(pwd2Input.title);
            } else {
                pwd2Input.pattern = this.pattern;
                pwd2Input.setCustomValidity("");
            }
        }, false);

        pwd2Input.addEventListener("keyup", function(e) {
            this.setCustomValidity(this.validity.patternMismatch ? pwd2Input.title : "");
        }, false);

    }

}, false);

