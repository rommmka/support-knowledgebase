<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $question = $_POST['question'];
    $answer = $_POST['answer'];
    
    // Escape commas in the question and answer to prevent CSV parsing issues
    $question = str_replace(',', '&#44;', $question);
    $answer = str_replace(',', '&#44;', $answer);
    
    // Escape newlines in the answer to keep it on one line in the CSV
    $answer = str_replace(["\r\n", "\r", "\n"], '&#10;', $answer);
    
    $newLine = "\n" . $question . ',' . $answer;
    
    file_put_contents('qa_data.csv', $newLine, FILE_APPEND);
    
    echo 'Success';
} else {
    http_response_code(405);
    echo 'Method Not Allowed';
}
