$(document).ready(function() {
    $('#addQAForm').on('submit', function(e) {
        e.preventDefault();
        
        const question = $('#question').val();
        const answer = $('#answer').val();
        
        $.ajax({
            url: 'add_qa.php',
            method: 'POST',
            data: { question: question, answer: answer },
            success: function(response) {
                // alert('New question/answer added successfully!');
                $('.popup-message').fadeIn().delay(2000).fadeOut();
                $('#question').val('');
                $('#answer').val('');
            },

            /**
             * Handles errors that occur during the addition of a new question/answer.
             *
             * @return {undefined} No return value, displays an error alert instead.
             */

            error: function() {
                alert('Error adding new question/answer. Please try again.');
            }
        });
    });
});
