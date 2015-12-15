function Update() {
    if (window.innerWidth > 1080) {
        $('#hero').css('height', window.innerHeight);
        $('#hero_floating_content').css('top', '50%');
        $('#down-arrow').css('display', 'block');
    }
    else {
        $('#hero').css('height', $('#hero_floating_content').outerHeight() + 160);
        $('#hero_floating_content').css('top', 80);
        $('#down-arrow').css('display', 'none');
    }
    $('.locked').css('max-height', $('#w').outerWidth());
}
setInterval(function () {
    Update();
}, 1000);

var question_number = 0;

function NextQuestion() {
    var new_section;
    $('.questions .question').each(function (i, obj) {
        if (i == question_number)
            new_section = $(this);
    });
    var center_v = (window.innerHeight * .5 - new_section.outerHeight() * .5);
    $("html, body").animate({ scrollTop: new_section.offset().top - (center_v > 0 ? center_v : 0) }, 270, 'swing');
    ++question_number;
}

//function addQuestion(prompt, difficulty, img, )
var datamem = "";
var level_index = new Array('w', 'x', 'y', 'z');

$(document).ready(function () {
    $('.gray-section').css('display', 'block');
    $('#vertical-fix').css('display', 'none');
    $('.loading-div').css('display', 'none');

    setInterval(function () {
        $('#down-arrow').toggleClass('down');
    }, 1000);

    $('#contact').click(function (e) {
        e.preventDefault();
        var center_v = (window.innerHeight * .5 - $('#start-section').outerHeight() * .5);
        $("html, body").animate({ scrollTop: $("#start-section").offset().top - (center_v > 0 ? center_v : 0)}, 270, 'swing');
    });

    $('#btn_login_fb').click(function (e) {
        e.preventDefault();
        fb_login();
    });

    $('.level-block').click(function (e) {
        e.preventDefault();
        //Display the loading thingy
        $('#loading-div-pre').css('display', 'block');
        $('#qspacephp').css('display', 'none');
        var center_v = (window.innerHeight * .5 - $('#loading-div-pre').outerHeight() * .5);
        $("html, body").animate({ scrollTop: $("#loading-div-pre").offset().top - (center_v > 0 ? center_v : 0) }, 270, 'swing');
        var obj = $(this);
        setTimeout(function () {
            //Load the questions from this level
            $.post("http://www.thestarwarstest.com/php/questions.php", {
                d: level_index.indexOf(obj.attr('id')) + 1
            }).done(function (data) {
                //Add them in :-)
                $('#qspacephp').html(cleanGarbage(data));
                $('#qspacephp').css('display', 'block');
                $('.gray-section').css('display', 'block');
                $('#loading-div-pre').css('display', 'none');
                question_number = 0;
                NextQuestion();
                $('.answers a').click(function (e) {
                    e.preventDefault();
                    //has it already been solved?
                    if (!$(this).parent().parent().hasClass("solved")) {
                        if ($(this).hasClass("correct")) {
                            $(this).css('background-color', 'rgb(0, 100, 0)');
                        } else {
                            $(this).css('background-color', 'rgb(100, 0, 0)');
                            //Mark the correct answer!
                            var id = $(this).parent().parent().attr('id');
                            $("#" + id + " a.correct").addClass("selected");
                        }
                        $(this).parent().parent().addClass("solved");
                        setTimeout(function () {
                            NextQuestion();
                        }, 400);
                    }
                });
            });
        }, 500);
    });

    $('#send').click(function (e) {
        e.preventDefault();
        var valid_name = (cleanGarbage($('#f_name').val()) != "");
        var valid_email = validEmailAddress($('#f_email').val());
        var valid_message = (cleanGarbage($('#f_message').val()) != "");
        $('#progress').css('display', 'block');

        if (valid_name && valid_email && valid_message) {
            $.post("php/contact.php", {
                name: $('#f_name').val(),
                email: $('#f_email').val(),
                message: $('#f_message').val()
            }).done(function (data) {
                if (cleanGarbage(data) == "Success") {
                    $('#progress').html('Your message was sent :-)');
                }
                else {
                    $('#progress').html('Unexpected error :-/');
                }
            });
        } else {
            $('#progress').html('Invalid/Missing details.');
        }
    });
});

function validEmailAddress(input) {
    var atpos = input.indexOf("@");
    var dotpos = input.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= input.length) {
        return false;
    }
    return true;
}

function cleanGarbage(input) {
    var output = "";
    var acceptable = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM 1234567890`~!@#$%^&*()_+-={}|:\"<>?[]\;',./\r\n";
    for (var i = 0; i < input.length; ++i) {
        if (acceptable.indexOf(input[i]) != -1)
            output += input[i];
    }
    return output;
}

function loadImg(options, callback) {
    var seconds = 0,
    maxSeconds = 10,
    complete = false,
    done = false;

    if (options.maxSeconds) {
        maxSeconds = options.maxSeconds;
    }

    function tryImage() {
        if (done) { return; }
        if (seconds >= maxSeconds) {
            callback({ err: 'timeout' });
            done = true;
            return;
        }
        if (complete && img.complete) {
            if (img.width && img.height) {
                callback({ img: img });
                done = true;
                return;
            }
            callback({ err: '404' });
            done = true;
            return;
        } else if (img.complete) {
            complete = true;
        }
        seconds++;
        callback.tryImage = setTimeout(tryImage, 1000);
    }
    var img = new Image();
    img.onload = tryImage();
    img.src = options.src;
    tryImage();
}