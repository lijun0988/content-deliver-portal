
mindFrameControllers.controller('contentCreatorSecCtrl', [
    '$scope',
    'authenticationService',
    function ($scope, authenticationService) {
        $scope.authenticationService = authenticationService;
    }
]);

mindFrameControllers.controller('contentCreatorCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'selectCategoryAndSubCategoryService',
    'drawContentService',
    'AccountContentProvider',
    'ngMessages',
    '$modal',
    '$dialogs',
    '$timeout',
    '$http',
    'PathService',
    'VALIDATION_MESSAGES',
    'UI_CONSTANTS',
    function ($scope, $routeParams, $location, selectCategoryAndSubCategoryService, drawContentService,
        AccountContentProvider, ngMessages, $modal, $dialogs, $timeout, $http, PathService, VALIDATION_MESSAGES, UI_CONSTANTS) {
        $scope.VALIDATION_MESSAGES = VALIDATION_MESSAGES;
        $scope.minutesIntervalToAskForContentSaving = 6;
        $scope.selectCategoryAndSubCategoryService = selectCategoryAndSubCategoryService;
        $scope.countOfHeader = 0;

        $(".nav-header").click(function () {
            $(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
            $(this).next().slideDown()
        });
        $(".demo").css("min-height", $(window).height() - ($(window).height()/2) - 50);
        $("#sidebar").css("min-height", $(".contentCreator-content").height()-12);


        if ($routeParams.id == "new") {
            $scope.accountContent = new AccountContentProvider();
            $scope.accountContent.counterpart = false;
            $scope.accountContent.content = [];
            $scope.accountContent.enabled = true;
            $scope.selectCategoryAndSubCategoryService.selectedCategory = '';
            $scope.selectCategoryAndSubCategoryService.selectedSubCategory = '';
        } else {
            $scope.accountContent = AccountContentProvider.get({
                id: $routeParams.id,
                account: $scope.currentAccount
            }, function (data) {
                if(data.content){
                    $scope.setDragAllowClasses(data.content);
                }
                if (data.category) {
                    $scope.selectCategoryAndSubCategoryService.selectedCategory = data.category.id;
                }
                if (data.subCategory) {
                    $scope.selectCategoryAndSubCategoryService.selectedSubCategory = data.subCategory.id;
                }

                // sort data.content by it's order property
                // (a.order-b.order -> ascending, b.order-a.order ->
                // descending)
                data.content.sort(function (a, b) {
                    return (a.order - b.order);
                });
            });
        }

        $scope.dragging = false;
        $scope.existOneSubTab = false;
        $scope.showContentField = true;

        //count number of columns in one content
        $scope.numberOfColumnsMajorThanThree = false

        //init variables 
        $scope.dragComponentType = false;
        $scope.existColumnsAtSecondLevel = false;
        $scope.existFirstLevel = false;

        $scope.addActiveClass = function (evt) {
            $('.content-elements').find('ul.selectedElement').removeClass('selectedElement');
            $(evt.target).parent().addClass('selectedElement');
        }

        $scope.publish = function () {
            $http({
                method: 'POST',
                url: PathService.getContentPublishUrl($scope.accountContent.id)
            }).
            success(function (res, status) {
                if (res.success) {
                    ngMessages.show('Content is now published', 'success', true);
                }
            });
        };

        $scope.startDrag = function() {
            $scope.dragging = true;
        };

        $scope.stopDrag = function(element) {
            $scope.dragComponentType = element.target.id.split("-")[1];
            
            $scope.dragging = false;      
        };

        $scope.setDragAllowClasses = function(content){
            if(content != undefined){
                $scope.accountContent.content = content;
            }
           for (var i = 0; i < $scope.accountContent.content.length; i++) {
                if(!$scope.existOneSubTab && $scope.accountContent.content[i].componentType == "TabBar"){
                    $scope.existOneSubTab = true;
                    $("#componentType-Column").removeClass("drag-allow-for-desktop");
                    $("#componentType-TwoColumn").removeClass("drag-allow-for-desktop");
                    $("#componentType-ThreeColumn").removeClass("drag-allow-for-desktop");

                    $("#componentType-Tab").removeClass("drag-allow-for-desktop");
                    break;
                }
                if($scope.accountContent.content[i].componentType == "Columns"){
                    $scope.existOneColumn = true;
                    $("#componentType-Tab").removeClass("drag-allow-for-desktop");
                    break;
                }
            }           
        };

        $scope.fixFirstContent = function(){
            for (var i = 0; i < $scope.accountContent.content.length; i++) {
                if($scope.accountContent.content[i].componentType == "Header" ||
                    $scope.accountContent.content[i].componentType == "Image" ||
                    $scope.accountContent.content[i].componentType == "List"){
                    $scope.accountContent.content.splice(i, 1);
                }
            }
        };
        

        $scope.onDrop = function(element){

            if($scope.dragComponentType == "Tab"){
                $scope.openTabPropertiesDialog($scope.accountContent.content[0].content[0]);
            }
            
            if($scope.dragComponentType == "Header" || $scope.dragComponentType == "Image" || $scope.dragComponentType == "List"){

                if($scope.existFirstLevel){
                    $scope.existColumnsAtSecondLevel = $scope.accountContent.content[0].content[0].content[0].componentType == "Columns";
                }
                
                if($scope.accountContent.content.length == 1){
                    $scope.accountContent.content.push($scope.getComponentCompound($scope.dragComponentType)); 
                    $scope.existFirstLevel = true;             
                }
                
                if($scope.accountContent.content.length == 2 
                    && $scope.accountContent.content[0].componentType == "TabBar"
                   // && $scope.accountContent.content[0].content.length != 0
                    && !$scope.existColumnsAtSecondLevel){
                    $scope.existFirstLevel = true;
                    $scope.accountContent.content[0].content[0].content.push($scope.getComponentCompound($scope.dragComponentType));
                }
            }

            $scope.fixFirstContent();
            $scope.setDragAllowClasses();
        };

        $scope.removeContent = function (idx, content) {

            if(content[idx].componentType == "TabBar")
            {
                $scope.existOneSubTab = false;
                $("#componentType-Column").addClass("drag-allow-for-desktop");
                $("#componentType-TwoColumn").addClass("drag-allow-for-desktop");
                $("#componentType-ThreeColumn").addClass("drag-allow-for-desktop");

                $("#componentType-Tab").addClass("drag-allow-for-desktop");
            }
            if(!$scope.existOneSubTab && content[idx].componentType == "Columns")
            {
                $("#componentType-Tab").addClass("drag-allow-for-desktop");
            }
            if(content[idx].componentType == "Column")
            {
                $scope.numberOfColumnsMajorThanThree = false
            }

            $scope.dragging = false;
            
            content.splice(idx, 1);
            for (var i = 0; i < content.length; i++) {
                content[i].order = i;
            };

            if(content.length == 0){
                $scope.existFirstLevel = false;
                $scope.existColumnsAtSecondLevel = false;
            }
            if(content.length == 1){
                $scope.existColumnsAtSecondLevel = false;
            }
        };

        $scope.clear = function () {
            $scope.accountContent.content.length = 0;
        };

        $scope.listTypes = [{
            type: "No Bullet Points",
            id: "NONE_BULLETS"
        },{
            type: "Bullet Points",
            id: "NONE"
        }, {
            type: "Thumbs Up/Neutral/Down",
            id: "THUMBS_UP_DOWN_NEUTRAL"
        }, {
            type: "Thumbs Up/Neutral",
            id: "THUMBS_UP_NEUTRAL"
        }, {
            type: "Checkboxes",
            id: "CHECKBOXES"
        }];

        $scope.componentTabBar = {
            componentType: 'TabBar',
            content: [{
                componentType: 'Tab',
                active: true,
                content: []
            }]
        };

        $scope.componentOneColumn = {
            componentType: 'Columns',
            content: [{
                componentType: 'Column',
                content: [],
                order: 0
            }]
            
        };

        $scope.componentTwoColumn = {
            componentType: 'Columns',
            content: [{
                componentType: 'Column',
                content: [],
                order: 0
            }, {
                componentType: 'Column',
                content: [],
                order: 1
            }]
        };

        $scope.componentThreeColumn = {
            componentType: 'Columns',
            content: [{
                componentType: 'Column',
                content: [],
                order: 0
            }, {
                componentType: 'Column',
                content: [],
                order: 1
            }, {
                componentType: 'Column',
                content: [],
                order: 2
            }]
        };

        $scope.componentListColumn = {
            componentType: 'Columns',
            content: [{
                componentType: 'Column',
                content: [{
                    componentType: 'List',
                    content: [],
                    allowsNotes: true,
                    operation: 'NONE',
                    listType: {
                        id: 'NONE',
                        type: 'Bullet Points'
                    }
                }],
                order: 0
            }]
        };

        $scope.componentImageColumn = {
            componentType: 'Columns',
            content: [{
                componentType: 'Column',
                content: [{
                    componentType: 'Image',
                    image: 'AVATAR_OWN',
                    position: 'LEFT',
                    size: 'NORMAL'
                }],
                order: 0
            }]
        };


        $scope.componentHeaderColumn = {
            componentType: 'Columns',
            content: [{
                componentType: 'Column',
                content: [{
                    componentType: 'Header',
                    icon: 'AVATAR_OWN',
                    title: "Header",
                    position: 'LEFT'
                }],
                order: 0
            }]
        };

        $scope.getComponentCompound = function(element){
            switch (element){
                case 'Header':
                    return angular.copy($scope.componentHeaderColumn);
                    break;
                case 'Image':
                    return angular.copy($scope.componentImageColumn);
                    break;
                case 'List':
                    return angular.copy($scope.componentListColumn);
                    break;
            }
        };


        $scope.componentList = {
            componentType: 'List',
            content: [],
            allowsNotes: true,
            operation: 'NONE',
            listType: {
                id: 'NONE',
                type: 'Bullet Points'
            }
        };

        $scope.componentImage = {
            componentType: 'Image',
            image: 'AVATAR_OWN',
            position: 'LEFT',
            size: 'NORMAL'
        };

        $scope.componentHeader = {
            componentType: 'Header',
            icon: 'AVATAR_OWN',
            title: "Header",
            position: 'LEFT'
        };
        


        $scope.changeType = function (listType, list) {
            list.listType = listType;
            list.operation = listType.id;
        };

        $scope.changeAllowsNotes = function (allows, list) {
            list.allowsNotes = allows;
        };


        $scope.changeImage = function (img, image) {
            image.image = img;
        };

        $scope.changeImageSize = function (size, image) {
            image.size = size;
        };

        $scope.changeImagePosition = function (pos, image) {
            image.position = pos;
        };

        $scope.changeHeaderPosition = function (pos, header) {
            header.position = pos;
        };

        $scope.changeHeaderIcon = function (icon, header) {
            header.icon = icon;
        };

        $scope.addColumn = function (content) {

            if(content.length < 3){
                content.push({
                componentType: 'Column',
                content: []
                });

            }
        };

        $scope.addCue = function (content) {
            var cue = {
                index: content.length,
                componentType: 'Cue',
                isNew: true
            };
            $scope.openCuePropertiesDialog(cue, content);
        };

        $scope.addTab = function (tabBar) {
            angular.forEach(tabBar.content, function (tab) {
                tab.active = false;
            });
            var tab = {
                componentType: 'Tab',
                active: true,
                content: []
            };
            tab["order"] = tabBar.content.length;
            tabBar.content.push(tab);
            $scope.openTabPropertiesDialog(tab);
        };

        $scope.moveUp = function (idx, content) {
            var newPos = idx - 1;
            var value = content[idx];
            if (idx === -1) {
                return;
            }

            if (newPos < 0)
                newPos = 0;

            content.splice(idx, 1);
            content.splice(newPos, 0, value);

            for (var i = 0; i < content.length; i++) {
                content[i].order = i;
            };
        };

        $scope.moveDown = function (idx, content) {
            var newPos = idx + 1;
            var value = content[idx];

            if (newPos >= content.length)
                newPos = content.length;

            content.splice(idx, 1);
            content.splice(newPos, 0, value);

            for (var i = 0; i < content.length; i++) {
                content[i].order = i;
            };
        };

        $scope.moveRight = function (index, content) {
            var newPos = index + 1;
            var value = content[index];

            if (newPos >= content.length)
                newPos = content.length;

            content.splice(index, 1);
            content.splice(newPos, 0, value);

            for (var i = 0; i < content.length; i++) {
                content[i].order = i;
            };
        };

        $scope.moveLeft = function (index, content) {
            var newPos = index - 1;
            var value = content[index];
            if (index === -1) {
                return;
            }

            if (newPos < 0)
                newPos = 0;

            content.splice(index, 1);
            content.splice(newPos, 0, value);

            for (var i = 0; i < content.length; i++) {
                content[i].order = i;
            };
        };

        $scope.preview = function () {
            $("#contentCreatorContainer").addClass("devpreview");

            $(".heading").each(function () {
                $(this).data('html-code', $(this).html());
                $(this).html($(this).text());
            });

            $("i.edit-que-btn").addClass("devpreview");
            $(".hide-on-preview").addClass("devpreview");
            $(".hide-tabs-on-preview").addClass("devpreview");

            $("button#edit").removeAttr('disabled');
            $("button#sourcepreview").attr('disabled', 'disabled');

        };

        $scope.edit = function () {
            $("#contentCreatorContainer").removeClass("devpreview");
            $("i.edit-que-btn").removeClass("devpreview");

            $(".cue-text").each(function () {
                $(this).html($(this).data('html-code'));
            });

            $(".hide-on-preview").removeClass("devpreview");
            $(".hide-tabs-on-preview").removeClass("devpreview");

            $("button#edit").attr('disabled', 'disabled');
            $("button#sourcepreview").removeAttr('disabled');
        };

        $scope.toggleContentFieldsFunction = function () {
            $scope.showContentField = !$scope.showContentField;
            if (!$scope.showContentField) {
                $(".demo").css("min-height", $(window).height() - 200);
                $(".contenteditfields").addClass("contentFieldHidden");
                $(".contenteditfields").removeClass("contentFieldShown");
                $("#sidebar").css("min-height", $(".contentCreator-content").height()-12);
            } else {
                $(".demo").css("min-height", $(window).height() - ($(window).height()/2) - 50);
                $(".contenteditfields").addClass("contentFieldShown");
                $(".contenteditfields").removeClass("contentFieldHidden");
                $("#sidebar").css("min-height", $(".contentCreator-content").height()-12);
            }
        };

        $scope.clearEmptyCues = function(content){
            angular.forEach(content, function (cnt, idx) {
            	if(cnt.componentType=="Cue"){
            		if(!cnt.text||cnt.text.trim().length == 0){
            			console.log('Removing');
            			content.splice(idx, 1);
            		}
            	}
            	if(cnt.content){
            		$scope.clearEmptyCues(cnt.content);
            	}
            });
        };

        $scope.save = function() {

            if(selectCategoryAndSubCategoryService.selectedSubCategory != UI_CONSTANTS.selectOption.id){
                $scope.accountContent.subCategory = {
                     id: selectCategoryAndSubCategoryService.selectedSubCategory
                };
            }

            if(selectCategoryAndSubCategoryService.selectedCategory != UI_CONSTANTS.selectOption.id){
                $scope.accountContent.category = {
                    id: selectCategoryAndSubCategoryService.selectedCategory
                };
             }

            var contentToSave = new AccountContentProvider($scope.accountContent);

            $scope.clearEmptyCues(contentToSave.content);

            var contentSaved = $scope.accountContent.content;

            if (!$scope.accountContent.id) {
                var disabled = $scope.accountContent.name == '' || $scope.createContentForm.Name.$invalid || $scope.accountContent.description == '' || $scope.createContentForm.Description.$invalid;
                if(!disabled){
                    contentToSave.$create({
                        account: $scope.currentAccount,
                        id: 'all'
                    }, function (resp) {
                        $scope.accountContent = new AccountContentProvider(resp.data);
                        $scope.accountContent.content = [];
                        $scope.accountContent.content = contentSaved;
                        ngMessages.show($scope.messages.contentSaved, 'success', true);

                    });
                }
            } else {
                contentToSave.$update({
                    account: $scope.currentAccount,
                    id: $scope.accountContent.id
                }, function (resp) {
                    $scope.accountContent = new AccountContentProvider(resp.data);
                    $scope.accountContent.content = [];
                    $scope.accountContent.content = contentSaved;
                    ngMessages.show($scope.messages.contentSaved, 'success', true);
                });
            }
              
        };

        $scope.leaveContentCreator = function (loc) {
          $scope.safeApply(function () {
            $location.path(loc);
            $scope.selectCategoryAndSubCategoryService.selectedCategory = null;
            $scope.selectCategoryAndSubCategoryService.selectedSubCategory = null;
          });
        }

        $scope.goBackToList = function () {
            $scope.leaveContentCreator('admin/content');
        };

        $scope.confirmLeave = function (toLocation) {
          $scope.dialogPresent = true;
          var dlg = $dialogs.confirm($scope.messages.confirmLeaveHeader, $scope.messages.confirmLeaveMessage);
          dlg.result.then(function () {
            $scope.leaveConfirmed = true;
            if (toLocation == '/admin/contentCreator/new') {
              toLocation = 'admin/content';
            }
            $scope.leaveContentCreator(toLocation);
            $scope.dialogPresent = false;
          }, function () {
            $scope.dialogPresent = false;
          });
        };

        $scope.$on('$locationChangeStart', function (event, next, current) {
            if($scope.dialogPresent) event.preventDefault();
            if (!$scope.accountContent.id && $scope.accountContent.content.length > 0 && !$scope.leaveConfirmed && !$scope.dialogPresent) {
                event.preventDefault();
                $scope.safeApply(function () {
              if (!$scope.dialogPresent) {
                var toLocation = $location.path();
                $scope.confirmLeave(toLocation);
              }
            });
          }
        });

        $scope.openTabPropertiesDialog = function (tab) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/admin/content/tabPropertiesDialog.html',
                controller: 'tabPropertiesController',
                windowClass: 'modal-one-col',
                resolve: {
                    selectedTab: function () {
                        return tab;
                    }
                }
            });

            // And when back to the list do as below...
            modalInstance.result.then(function (tab) {
                /*ngMessages.show($scope.messages.categoryCreated.replace('__CATEGORYNAME__', resultCategory.name),
                        'success', true);*/
            }, function () {
                /*$scope.resetListForm();*/
            });
        };


        $scope.saveAndAddCue = function (content) {
            $scope.save();
            var cue = {
                index: content.length,
                componentType: 'Cue',
                isNew: true
            };
            return cue;
        };

        $scope.openCuePropertiesDialog = function (cue, content) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/admin/content/cuePropertiesDialog.html',
                windowClass: 'modal-two-col',
                controller: 'cuePropertiesController',
                backdrop: 'static',
                scope: $scope,
                resolve: {
                    selectedCue: function () {
                        return cue;
                    },
                    selectedContent: function () {
                        return content;
                    }
                }
            });
        };

        $scope.enableContent = function(){
        	$scope.accountContent.enabled=true;
        };

        $scope.disableContent = function(){
        	$scope.accountContent.enabled=false;
        };

        $scope.addFirstCue = function (content) {
          if (content.length == 0) {
            var cue = {
                index: content.length,
                componentType: 'Cue',
                isNew: true,
                editing:true,
                focus:false,
            };
            content.push(cue);
          }
        }

        $scope.addNewCue=function(content){
            var lastCue = content[content.length-1];
            if((lastCue.text && lastCue.text.trim().length > 0 )){
            var cue = {
                index: content.length,
                componentType: 'Cue',
                isNew: true,
                editing:true,
                focus:false,
            };
            content.push(cue);
            }
        };

        $scope.removeEmptyCue = function(content, idx) {
          content.splice(idx, 1);
        }

        $scope.cueChanged = function(cue, content, idx) {
          if (cue.text && cue.text.trim().length > 0) {
            if (idx+1 == content.length) {
              $scope.addNewCue(content);
            }
          } else {
            $scope.removeEmptyCue(content, idx);
          }
        };

        $scope.cueBlurred = function (cue){
            if((cue.text && cue.text.trim().length > 0 )){
                cue.editing = false;
                $scope.save();
            }
        };

        $scope.focusArea = function (cue,idx){
            var textAreaIdJq= "#"+idx +"-cue-title-textarea";
            var textAreaId= idx +"-cue-title-textarea";
            var cueTextIndex=".cue-text-"+idx;
            cue.editing = true;
            cue.focus = true;
            $('.cue-li').find(textAreaIdJq).css('display','block');
            document.getElementById(textAreaId).focus();
        };
    }
]);
