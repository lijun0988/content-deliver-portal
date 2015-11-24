var module = angular.module('resources', [ 'ngResource', 'services.pathService' ]);

module.factory('Resource', [ '$resource', function($resource) {
	return function(url, params, methods) {
		var defaults = {
		    get : {
				method : 'get',
	            transformResponse: function (data, headersGetter) {
	                var wrapped = angular.fromJson(data); 
	            	if(wrapped.success){
	            		if(wrapped.payload){
	            			return wrapped[wrapped.payload];	
	            		}else if(wrapped.data && !wrapped.total){
	            			return wrapped.data;
	            		}else{

	            			return wrapped;
	            		}
	            	}
	            }
		    },
		    query : {
				method : 'get',
	            transformResponse: function (data, headersGetter) {
	                var wrapped = angular.fromJson(data); 
	            	if(wrapped.success){
	            		if(wrapped.payload){
	            			return wrapped[wrapped.payload];	
	            		}else if(wrapped.data&&!wrapped.total){
	            			return wrapped.data;
	            		}else{
	            			return wrapped;
	            		}
	            	}
	            }
		    },
			update : {
				method : 'put',
				isArray : false
			},
			create : {
				method : 'post'
			},
            remove : {
                method : 'delete'
            }
		};

		methods = angular.extend(defaults, methods);

		var resource = $resource(url, params, methods);

		resource.prototype.$save = function() {
            if (!this.id) {
                return this.$create();
            } else {
                return this.$update();
            }
        };

        return resource;
    };
} ]);

module.factory( 'AccountContentProvider', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getAccountContentProviderResourceUrl(), { id:'@id', account:'@account'} );
}]);

module.factory( 'AccountContentProviderAction', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getAccountContentProviderActionResourceUrl(), {contentId:'@contentId', id:'@id', account :'@account'} );
}]);

module.factory( 'BillingInfo', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getBillingInfoResourceUrl(), { id: '@id' , account : '@account'} ); 
}]);

module.factory( 'Category', [ 'Resource', 'PathService', function( $resource, PathService) {
	return $resource( PathService.getCategoryResourceUrl(), { id: '@id' } );
}]);

module.factory( 'ContentProvider', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getContentProviderResourceUrl(), { id: '@id' , account : '@account'} );
}]);

module.factory( 'CreditCardTypes', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource(PathService.getCreditCardTypesResourceUrl(), {account:'@account'} );
}]);

module.factory( 'Person', [ 'Resource', 'PathService', function($resource, PathService) {
    return $resource( PathService.getPersonResourceUrl(), { id: '@id' , account : '@account' } );
}]);

module.factory( 'Plan', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getPlanResourceUrl(), { id: '@id' } );
}]);

module.factory( 'Product', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getProductResourceUrl(), { id: '@id' } );
}]);

module.factory( 'superUser', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getSuperUserResourceUrl(), { id: '@id' } );
}]);

module.factory( 'Tab', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getTabResourceUrl(), { id: '@id' , account : '@account'} );
}]);

module.factory( 'User', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getUserResourceUrl(), { id: '@id' , account : '@account' } );
}]);
