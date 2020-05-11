$(document).ready(function () {

	console.log('call : /public/index.js');


	$("#alert-success").hide();
	$("#alert-danger").hide();
	$("input").keyup(function () {
		var pwd1 = $("#user_password").val();
		var pwd2 = $("#user_password2").val();
		if (pwd1 != "" || pwd2 != "") {
			if (pwd1 == pwd2) {
				$("#alert-success").show();
				$("#alert-danger").hide();
				$("#btn-submit").removeAttr("disabled");
			} else {
				$("#alert-success").hide();
				$("#alert-danger").show();
				$("#btn-submit").attr("disabled", "disabled");
			}
		}
	});


	$(".login-submit").click(function () {
		var userId = $("input[name='userId']").val();
		var user_password = $("input[name='user_password']").val();

		/* 에러 분기처리 */
		if (!userId) {
			swal('경고', '아이디를 입력해주세요.', 'error')
		} else if (!user_password) {
			swal('경고', '비밀번호를 입력해주세요.', 'error')
		} else {
			$(this).closest("form").submit(); //(DOM에서 'form'을 찾아 submit)
		}
	});

	$(".post-submit").click(function () {
		var title = $("input[name='title']").val();
		var content = $("textarea[name='content']").val();
		var author = $("input[name='author']").val();
		/* 에러 분기처리 */
		if (!title) {
			swal('경고', '제목을 입력해주세요.', 'error')
		} else if (!content) {
			swal('경고', '내용을 입력해주세요.', 'error')
		} else if (!author) {
			swal('경고', '작성자를 입력해주세요.', 'error')
		} else {
			$(this).closest("form").submit(); //(DOM에서 'form'을 찾아 submit)
		}
	});
	
	
		$(".btn-submit").click(function () {
		var agree = $("input:checkbox[name='agree']").is(":checked");
		/* 에러 분기처리 */
		if (!agree) {
			swal('경고', '약관동의을 체크해주세요.', 'error');
		}
		else {
			$(this).closest("form").submit(); //(DOM에서 'form'을 찾아 submit)
		}
	});
});

/**
 * 에러메세지를 띄웁니다.
 */
function showError(msg) {
	swal({
		type: 'error',
		title: '에러코드',
		text: JSON.stringify(msg),
	})
}

 $(".btn-delete").click(function () {
        var _id = $(this).data("id");
        swal({
            title: '경고',
            text: "정말 지우시겠습니까?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네 삭제하겠습니다',
            cancelButtonText: '아니요'
        }).then(function () {
            $.ajax({
                url: '/postdelete',
                type: 'post',
                data: {id: _id},
                success: function (response) {
                    location.href = '/postindex';
                }
            });
        })
    });
