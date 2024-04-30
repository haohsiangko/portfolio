$(document).ready(function() {

    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vRpRXbF-Qp737S3qVOAlxVxzeKn6UYCS6M3qTxkqpd81XZ5b-EbFndsmlrDUQh3RxgULOT8HHePA2HV/pub?output=csv', {
        download: true,
        header: true,
        complete: function(results) {
            showCards(results.data);
        }
    });

    // 顯示卡片
  function showCards(data) {
    console.log(data);
    const cardGrid = $('.card-grid');
    const btnGroup = $('.btn-group');

    // 獲取所有分類
    const categories = new Set(data.flatMap(item => item.category.split(',').map(c => c.trim())));
    const categories_2 = new Set(data.flatMap(item => item.category_2.split(',').map(c => c.trim())));

    // All按钮
    const allBtn = $('<button></button>')
    .addClass('btn btn-category active')
    .text('All')
    .attr('data-category', 'all')
    .click(toggleAll);
    btnGroup.append(allBtn);

    btnGroup.append("<br>")

    categories.forEach(category => {
      const btn = $('<button></button>')
        .addClass('btn btn-category')
        .text(category)
        .attr('data-category', category)
        .click(toggleCategory); 

      btnGroup.append(btn);
    });

    btnGroup.append("<br>")

    categories_2.forEach(category => {
        const btn = $('<button></button>')
          .addClass('btn btn-category')
          .text(category)
          .attr('data-category', category)
          .click(toggleCategory); 
  
        btnGroup.append(btn);
      });

    // 初始化
    showAllCards(data);

    


  // 按鈕點擊事件
function toggleCategory() {
    const category = $(this).data('category');
    $(this).toggleClass('active');
    updateCardState(category);
  }

  // All按鈕點擊事件
function toggleAll() {
    const allBtn = $(this);
    const isActive = allBtn.hasClass('active');
    if (isActive) {
        allBtn.removeClass('active');
    } else {
        allBtn.addClass('active');
    }
    updateCardState();
}
  
  
  // 初始化按鈕狀態並顯示卡片
  $('.btn-category').each(function() {
    const category = $(this).data('category').replace(/ /g, "-");
    // console.log(category);

    const isActive = $(this).hasClass('active');
    if (isActive) {
      $(`.card[data-category-${category}="true"]`).show();

    }
  });
  

function updateCardState(category) {
    const allBtn = $('.btn-category[data-category="all"]');
    const isAllActive = allBtn.hasClass('active');

    $('.card').each(function() {
        const card = $(this);
        let shouldShow = false;

        if (isAllActive) {
            shouldShow = true;
        } else {
            const activeCategories = $('.btn-category.active').map(function() {
                return $(this).data('category').replace(/ /g, "-");
            }).get();

            console.log("now");
            console.log(activeCategories);

            activeCategories.forEach(function(activeCategory) {
                const isActive = $(`.btn-category[data-category="${activeCategory}"]`).hasClass('active');
                const cardHasCategory = card.attr(`data-category-${activeCategory}`) === 'true';


                if (isActive && cardHasCategory) {
                    shouldShow = true;
                    // console.log(isActive && cardHasCategory);
                }
            });
        }

        if (shouldShow) {
            card.show();
            // console.log(shouldShow);
        } else {
            card.hide();
        }
    });
}



    // 顯示所有卡片
    function showAllCards(data) {
      cardGrid.empty();

      data.forEach(item => {
        const card = $('<div class="card"></div>').attr('data-id', item.id);
        const cardImage = $('<img>').attr('src', item.image_url).attr('class','cover');
        
        // 包含label和title
        const cardContent = $('<div class="card-content"></div>');

        const cardLable = $('<div class="card-label"></div>').text(item.label);
        cardContent.append(cardLable);
        cardContent.append('<br>');

        const cardTitle = $('<div class="card-title"></div>').text(item.title);
        cardContent.append(cardTitle);
        
        card.append(cardContent);
        
        
        const cardCategories = item.category.replace(/ /g, "-").split(',').map(c => c.trim());
        const cardCategories_2 = item.category_2.replace(/ /g, "-").split(',').map(c => c.trim());



        cardCategories.forEach(category => {
          card.attr('data-category-' + category, 'true'); // 多選
        });
        cardCategories_2.forEach(category => {
            card.attr('data-category-' + category, 'true'); 
          });


        card.append(cardImage, cardContent);
        card.click(function() {
          showModal(item);
        });

        cardGrid.append(card);
      });
    }
  }

  // 彈窗
  function showModal(item) {
    const modal = $('.modal');
    const modalLabel = $('.modal-label');
    const modalTitle = $('.modal-title');
    const modalDate = $('.modal-date');
    const modalImage = $('.modal-image');
    const modalBriefing = $('.modal-briefing');
    const modalDescription = $('.modal-description');
    const modalHonor = $('.modal-honor');
    const modalCredits = $('.modal-credits');

    modalLabel.text(item.label);
    modalTitle.text(item.title);
    modalDate.text(item.published_date);
    modalImage.attr('src', item.image_url);
    modalImage.wrap('<a href="' + item.url + '" target="_blank"></a>');
    modalBriefing.html(item.briefing+"<br>");
    modalDescription.html(item.description+"<br>");
    modalHonor.html(item.honor+"<br>");

    // 清空原有的 credits
    modalCredits.empty();


    const creditsArray = item.credits.split(',');
    creditsArray.forEach(keyword => {
        const creditSpan = $('<span></span>').addClass('modal-credit').text(keyword.trim());
        modalCredits.append(creditSpan);
    });

    modal.css('display', 'block');
  }

  // 關閉彈窗
  $('.close').click(function() {
    $('.modal').css('display', 'none');
  });

  $(window).click(function(event) {
    if (event.target == $('.modal')[0]) {
      $('.modal').css('display', 'none');
    }
  });
});