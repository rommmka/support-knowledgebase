// Функція для завантаження даних з Google Таблиці
function loadQAData() {
    $.get('qa_data.csv', function(data) {
        const rows = data.split('\n');
        let qaHtml = '';
        
        rows.forEach(function(row) {
            const [question, answer] = row.split(',');
            if (question && answer) {
                const formattedQuestion = formatUrls(question);
                const formattedAnswer = formatUrls(answer);
                qaHtml += `
                    <div class="qa-item">
                        <div class="question">${formattedQuestion}</div>
                        <div class="answer-container">
                            <div class="copy-icon" data-answer="${encodeURIComponent(answer)}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                                    <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
                                </svg>
                            </div>
                            <div class="answer">${formattedAnswer}</div>
                        </div>
                    </div>
                `;
            }
        });
        
        $('#qaList').html(qaHtml);
        filterQuestions();
    });
}
    function formatUrls(text) {
        // Format URLs
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Format code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Format examples
        text = text.replace(/(Example:.*)/g, '<br><strong>$1</strong>');
        
        // Make every line start from a new line
        text = text.split('\n').join('<br>');
        
        return text;
    }


// Функція для фільтрації запитань
function filterQuestions() {
    const searchText = $('#searchInput').val().toLowerCase();
    $('.qa-item').each(function() {
        const questionText = $(this).find('.question').text().toLowerCase();
        if(searchText === '' || questionText.includes(searchText)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}
// Завантаження даних при завантаженні сторінки
$(document).ready(function() {
    loadQAData();
    $('#searchInput').on('keyup', filterQuestions);

    $('#darkmode-toggle').on('change', function() {
        $('body').toggleClass('dark-mode');
        localStorage.setItem('darkMode', $('body').hasClass('dark-mode'));
    });

    if (localStorage.getItem('darkMode') === 'true') {
        $('body').addClass('dark-mode');
        $('#darkmode-toggle').prop('checked', true);
    }

    $(document).on('click', '.copy-icon', function() {
        const answerText = decodeURIComponent($(this).data('answer'));
        const cleanedText = $('<textarea>').html(answerText).text();
    
        navigator.clipboard.writeText(cleanedText).then(() => {
            const icon = $(this);
            icon.addClass('copied');
            setTimeout(() => icon.removeClass('copied'), 1500);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    });
});
function copyTextToClipboard(text, icon) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showCopiedAnimation(icon);
        }, function(err) {
            console.error('Could not copy text: ', err);
            fallbackCopyTextToClipboard(text, icon);
        });
    } else {
        fallbackCopyTextToClipboard(text, icon);
    }
}

function fallbackCopyTextToClipboard(text, icon) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        if (successful) {
            showCopiedAnimation(icon);
        } else {
            console.error('Fallback: Unable to copy');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function showCopiedAnimation(icon) {
    icon.addClass('copied');
    setTimeout(() => icon.removeClass('copied'), 1500);
}