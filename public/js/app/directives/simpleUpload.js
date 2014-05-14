mage.directive('simpleUpload', function() {
  return {
    restrict: "A",
    scope: {
      url: '@'
    },
    controller: function ($scope, $element) {

      $element.find('.file-custom').attr('data-filename', 'Choose a file...');

      $element.find(':file').change(function() {
        $scope.file = this.files[0];
        var name = $scope.file.name;

        $element.find('.file-custom').attr('data-filename', name);

        previewFile($scope.file);
        upload();
      });

      var previewFile = function(file) {
        if (window.FileReader) {
          var reader = new FileReader();

          reader.onload = (function(theFile) {
                return function(e) {
                  $element.find('.preview').html(['<img src="', e.target.result,'" title="', theFile.name, '" style="max-width: 50px;" />'].join(''));
                };
          })(file);

          reader.readAsDataURL(file);
        }
      }

      var uploadProgress = function(e) {
        if(e.lengthComputable){
          console.log("progress is " + e.loaded + " of " + e.total);
          //$('progress').attr({value:e.loaded,max:e.total});
        }
      }

      var upload = function() {
        console.log("URL chnaged or upload fired ", $scope.url);
        if (!$scope.file) return;
        if (!$scope.url) return;
        var formData = new FormData($element[0]);
        // $.ajax({
        //     url: $scope.url,  //Server script to process data
        //     type: 'POST',
        //     xhr: function() {  // Custom XMLHttpRequest
        //         var myXhr = $.ajaxSettings.xhr();
        //         if(myXhr.upload){ // Check if upload property exists
        //             myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
        //         }
        //         return myXhr;
        //     },
        //     //Ajax events
        //     // beforeSend: beforeSendHandler,
        //     // success: completeHandler,
        //     // error: errorHandler,
        //     // Form data
        //     data: formData,
        //     //Options to tell jQuery not to process data or worry about content-type.
        //     cache: false,
        //     contentType: false,
        //     processData: false
        // });

        $.ajax({
            url: $scope.url,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
              console.log("upload complete");
             },
             error: function() {
               console.log('upload failed');
             }
        });
      }

      $scope.$watch('url', upload);
    }
  };
});
