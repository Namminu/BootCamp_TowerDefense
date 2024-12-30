// 모달 HTML 파일 로드
async function loadModal(modalFile) {
    const response = await fetch(`htmls/modalHTMLs/${modalFile}`);
    const modalHtml = await response.text();
    document.getElementById('modalContainer').innerHTML = modalHtml;
}