export const getPaginationGroup = (
  currentPage,
  totalPages,
  maxPagesToShow = 3
) => {
  let pages = [];

  if (totalPages <= 6) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    // 🔹 Near the start
    if (currentPage <= maxPagesToShow) {
      pages = Array.from(
        { length: maxPagesToShow + 4 },
        (_, i) => i + 1
      );

      if (pages[pages.length - 1] < totalPages - 1) {
        pages.push("...", totalPages - 1, totalPages);
      }
    }

    // 🔹 Near the end
    else if (currentPage >= totalPages - maxPagesToShow) {
      pages = [1, 2, "..."];
      pages.push(
        ...Array.from(
          { length: maxPagesToShow + 2 },
          (_, i) => totalPages - maxPagesToShow - 1 + i
        )
      );
    }

    // 🔹 Middle
    else {
      pages = [1, 2];
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...", totalPages - 1, totalPages);
    }
  }

  return [...new Set(pages)];
};
