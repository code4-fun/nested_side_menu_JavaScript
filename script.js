window.onload = function() {
  // side menu close button handler
  document.addEventListener("click", e => {
    if(e.target && e.target.closest('.close_sidebar_button')){
      closeSideMenu()
    }
  })

  // side menu toggle button handler
  document.addEventListener("click", e => {
    if(e.target && e.target.closest('.toggle_sidebar_button')){
      if(document.querySelector('.sidebar').classList.contains('is-opened')){
        closeSideMenu()
      } else {
        document.querySelector('.sidebar').classList.add("is-opened")
      }
    }
  })

  // closes sidebar and all nested submenus
  const closeSideMenu = () => {
    document.querySelector('.sidebar').classList.remove("is-opened")

    const menuCheckboxes = document.querySelectorAll('.menu-checkbox')
    for(let item of menuCheckboxes){
      item.checked = false  // снятие чекбоксов, отвечающих за вложенные меню, чтобы при закрытии по крестику закрывались все вложенные меню
    }
  }

  // converts cyrillic characters to latin
  function transliterate(word){
    let answer = ""
      , a = {};

    a["Ё"]="YO";a["Й"]="I";a["Ц"]="TS";a["У"]="U";a["К"]="K";a["Е"]="E";a["Н"]="N";a["Г"]="G";a["Ш"]="SH";a["Щ"]="SCH";a["З"]="Z";a["Х"]="H";a["Ъ"]="'";
    a["ё"]="yo";a["й"]="i";a["ц"]="ts";a["у"]="u";a["к"]="k";a["е"]="e";a["н"]="n";a["г"]="g";a["ш"]="sh";a["щ"]="sch";a["з"]="z";a["х"]="h";a["ъ"]="'";
    a["Ф"]="F";a["Ы"]="I";a["В"]="V";a["А"]="A";a["П"]="P";a["Р"]="R";a["О"]="O";a["Л"]="L";a["Д"]="D";a["Ж"]="ZH";a["Э"]="E";
    a["ф"]="f";a["ы"]="i";a["в"]="v";a["а"]="a";a["п"]="p";a["р"]="r";a["о"]="o";a["л"]="l";a["д"]="d";a["ж"]="zh";a["э"]="e";
    a["Я"]="Ya";a["Ч"]="CH";a["С"]="S";a["М"]="M";a["И"]="I";a["Т"]="T";a["Ь"]="'";a["Б"]="B";a["Ю"]="YU";
    a["я"]="ya";a["ч"]="ch";a["с"]="s";a["м"]="m";a["и"]="i";a["т"]="t";a["ь"]="'";a["б"]="b";a["ю"]="yu";

    for (let i in word){
      if (word.hasOwnProperty(i)) {
        if (a[word[i]] === undefined){
          answer += word[i]
        } else {
          answer += a[word[i]]
        }
      }
    }
    return answer
  }

  // generates simple li element of side menu
  function generateSimpleLi(node){
    let li = document.createElement('li')
    let a = document.createElement('a')
    a.href = node.url
    a.className = 'catalog_link'
    a.innerText = node.title
    li.append(a)
    return li
  }

  // generates complex le element of side menu, which contains nested elements
  function generateComplexNode(node){
    let uid = transliterate(node.title.replace(/ /g, '_')).toLowerCase()
    let li = document.createElement('li')

    let labelChevron = document.createElement('label')
    labelChevron.className = 'right_chevron'
    labelChevron.htmlFor = uid
    labelChevron.innerText = '▶'

    let divArrow = document.createElement('div')
    divArrow.className = 'arrow_box'
    divArrow.append(labelChevron)

    let a = document.createElement('a')
    a.href = node.url
    a.className = 'catalog_link'
    a.innerText = node.title

    let divComplexMenuItem = document.createElement('div')
    divComplexMenuItem.className = 'complex_menu_item'
    divComplexMenuItem.append(a)
    divComplexMenuItem.append(divArrow)

    li.append(divComplexMenuItem)

    let input = document.createElement('input')
    input.type = 'checkbox'
    input.id = uid
    input.className = 'menu-checkbox'

    li.append(input)

    let divMenu = document.createElement('div')
    divMenu.className = 'menu'

    let divGoBack = document.createElement('div')
    divGoBack.className = 'go_back_content'
    divGoBack.innerText = '⬅ Вернуться назад'

    let labelToggle = document.createElement('label')
    labelToggle.className = 'menu_toggle'
    labelToggle.htmlFor = uid
    labelToggle.append(divGoBack)

    divMenu.append(labelToggle)

    let divTitleContent = document.createElement('div')
    divTitleContent.className = 'menu_title_content'
    divTitleContent.innerText = node.title

    let divTitle = document.createElement('div')
    divTitle.className = 'menu_title'
    divTitle.append(divTitleContent)

    divMenu.append(divTitle)
    divMenu.append(parseMenu(node.children))

    li.append(divMenu)

    return li
  }

  // parses menu object received from api
  const parseMenu = menu => {
    let html = document.createElement('ul')
    let stack = menu
    while(stack.length > 0) {
      const node = stack.shift()
      if(!node?.children){
        html.append(generateSimpleLi(node))
        // generate and insert <li>
      } else {
        // generateComplexNode(node)
        // generate complex tag <...>
        html.append(generateComplexNode(node))
        // stack.unshift(...node.children)
      }
    }
    return html
  }

  // generates side menu based on menu object received from api
  function generateSideMenu(menu){
    let divSidebar = document.createElement('div')
    divSidebar.className = 'sidebar'

    let divCloseSidebarButton = document.createElement('div')
    divCloseSidebarButton.className = 'close_sidebar_button'

    let divCrossText = document.createElement('div')
    divCrossText.className = 'close_sidebar_text'
    divCrossText.innerText = 'Закрыть меню'
    divCloseSidebarButton.append(divCrossText)

    let divCross = document.createElement('div')
    divCross.innerHTML = '&times;'
    divCloseSidebarButton.append(divCross)

    divSidebar.append(divCloseSidebarButton)

    let divCatalog = document.createElement('div')
    divCatalog.className = 'catalog'

    let divMenuTitle = document.createElement('div')
    divMenuTitle.className = 'menu_title'

    let divMenuTitleContent = document.createElement('div')
    divMenuTitleContent.className = 'menu_title_content'
    divMenuTitleContent.innerText = 'Каталог'
    divMenuTitle.append(divMenuTitleContent)

    divCatalog.append(divMenuTitle)
    divCatalog.append(parseMenu(menu))

    divSidebar.append(divCatalog)
    return divSidebar
  }

  // renders generated side menu
  const renderMenu = () => {
    fetch('http://84.38.180.229:86/api/menu')
      .then(res => res.json())
      .then(data => {
        document.querySelector('body').prepend(generateSideMenu(data))
      })
  }

  renderMenu()
}
