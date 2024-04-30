$(document).ready(function() {
    // 從 Google Spreadsheet 獲取資料
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

    // 獲取所有不同的分類
    const categories = new Set(data.flatMap(item => item.category.split(',').map(c => c.trim())));
    const categories_2 = new Set(data.flatMap(item => item.category_2.split(',').map(c => c.trim())));

    // 添加 All 按钮
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
        .click(toggleCategory); // 修改此處的點擊事件綁定函數

      btnGroup.append(btn);
    });

    btnGroup.append("<br>")

    categories_2.forEach(category => {
        const btn = $('<button></button>')
          .addClass('btn btn-category')
          .text(category)
          .attr('data-category', category)
          .click(toggleCategory); // 修改此處的點擊事件綁定函數
  
        btnGroup.append(btn);
      });

    // 初始化時顯示所有卡片
    showAllCards(data);

    


  // 按鈕點擊事件處理函數
function toggleCategory() {
    const category = $(this).data('category');
    $(this).toggleClass('active');
    updateCardState(category);
  }

  // All 按钮点击事件处理函数
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
  
// 更新卡片状态
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
        const cardImage = $('<img>').attr('src', item.image_url);
        
        // 创建包含标题和简要说明的 div 元素
        const cardContent = $('<div class="card-content"></div>');

        const cardLable = $('<div class="card-label"></div>').text(item.label);
        cardContent.append(cardLable);
        cardContent.append('<br>');

        // 创建标题元素并添加到 cardContent 中
        const cardTitle = $('<div class="card-title"></div>').text(item.title);
        cardContent.append(cardTitle);
        // cardContent.append('<br>');

        // // 创建简要说明元素并添加到 cardContent 中
        // const cardBriefing = $('<div class="card-briefing"></div>').text(item.briefing);
        // cardContent.append(cardBriefing);

        // 将 cardContent 添加到卡片中
        card.append(cardContent);
        
        
        const cardCategories = item.category.replace(/ /g, "-").split(',').map(c => c.trim());
        const cardCategories_2 = item.category_2.replace(/ /g, "-").split(',').map(c => c.trim());



        cardCategories.forEach(category => {
          card.attr('data-category-' + category, 'true'); // 添加多選類別的屬性
        });
        cardCategories_2.forEach(category => {
            card.attr('data-category-' + category, 'true'); // 添加多選類別的屬性
          });


        card.append(cardImage, cardContent);
        card.click(function() {
          showModal(item);
        });

        cardGrid.append(card);
      });
    }
  }

  // 顯示彈窗
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

    // 將 credits 拆分成陣列並處理每個關鍵字
    const creditsArray = item.credits.split(',');
    creditsArray.forEach(keyword => {
        // 創建一個 <span> 元素並設置樣式類別
        const creditSpan = $('<span></span>').addClass('modal-credit').text(keyword.trim());
        // 添加到 modalCredits 中
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