'use strict';

var selectCategoryAndSubCategoryServiceFactory = function () {
    var selectCategoryAndSubCategoryService = {};
    selectCategoryAndSubCategoryService.selectedCategory = null;
    selectCategoryAndSubCategoryService.selectedSubCategory = null;
    return selectCategoryAndSubCategoryService;
}

var drawContentServiceFactory = function () {
    var drawContentService = {};

    drawContentService.drawContent = function (container, content) {
        var createdContent = {};
        angular.forEach(content, function (value, key) {
            if (value.componentType == "Tab") {
                console.log("TAB>>> " + key);
                console.log(container.attr('id'));
                console.log(container.attr('class'));
            }
            if (createdContent[value.componentType]) {
                createdContent[value.componentType] += 1;
                drawContentService['append' + value.componentType](createdContent[value.componentType],
                    createdContent["siblingContainer" + value.componentType], value);
            } else {
                createdContent[value.componentType] = 1;
                createdContent["siblingContainer" + value.componentType] = drawContentService['draw' + value.componentType]
                (container, value);
            }
        });
    };

    drawContentService.drawTab = function (container, tab) {
        console.log("drawing tab");
        var tabElement = $("#componentType-Tab").clone();
        var bare = $(".bareView", tabElement);
        var siblings = $(".siblingContainer", tabElement);
        tabElement.attr("id", "tab" + new Date().getTime());
        bare.append(tab.title);
        container.append(tabElement);
        if (tab.content) {
            drawContentService.drawContent(bare, tab.content);
        }
        return siblings;
    };

    drawContentService.appendTab = function (size, container, tab) {
        console.log("appending tab");
        console.log(container.attr("id"));
        console.log(container.attr("class"));

        var columnElement = $("#componentType-Tab");
        var appenderView = $(".bareView", columnElement).clone();
        appenderView.attr("id", "tab" + new Date().getTime());

        var previousSize = 12 / (size - 1);
        var newSize = 12 / size;
        container.children().removeClass("span" + previousSize);
        container.children().addClass("span" + newSize);
        appenderView.removeClass("span12");
        appenderView.addClass("span" + newSize);
        appenderView.append("SIBLING" + tab.title);
        if (tab.content) {
            drawContentService.drawContent(appenderView, tab.content);
        }
        container.append(appenderView);
        return appenderView;
    };

    drawContentService.drawColumn = function (container, column) {
        console.log("drawing column");
        var columnElement = $("#componentType-Column").clone();
        columnElement.attr("id", "col" + new Date().getTime());
        var bare = $(".bareView", columnElement);
        var siblings = $(".siblingContainer", columnElement);
        bare.append("Col");
        if (column.content) {
            drawContentService.drawContent(bare, column.content);
        }
        container.append(columnElement);
        return siblings;
    };

    drawContentService.appendColumn = function (size, container, column) {
        console.log("appending column start");
        console.log(column);
        console.log("appending column end");
        var columnElement = $("#componentType-Column");
        var appenderView = $(".bareView", columnElement).clone();
        appenderView.attr("id", "col" + new Date().getTime());
        var previousSize = 12 / (size - 1);
        var newSize = 12 / size;
        container.children().removeClass("span" + previousSize);
        container.children().addClass("span" + newSize);
        appenderView.removeClass("span12");
        appenderView.addClass("span" + newSize);
        if (column.content) {
            drawContentService.drawContent(appenderView, column.content);
        }
        appenderView.append("Col");

        container.append(appenderView);
        return appenderView;
    };

    drawContentService.drawHeader = function (container, header) {
        console.log("drawing header")
    };

    drawContentService.drawList = function (container, list) {
        console.log("drawing List")
        if (list.content) {
            drawContentService.drawContent(container, list.content);
        }
    };

    drawContentService.drawCue = function (tab) {
        console.log("drawing Cue")
    };

    drawContentService.appendCue = function (tab) {
        console.log("drawing Cue")
    };

    drawContentService.drawImage = function (tab) {
        console.log("drawing Image")
    };

    return drawContentService;
}