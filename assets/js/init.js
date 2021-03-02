// Make the first page visible

const initialize = () => {
	const firstPage = document.querySelector('.form-section:first-child');
	firstPage.classList.add('active');

	// Initialize bootstrap-validator
	$(".form").validator();
};

export default initialize;