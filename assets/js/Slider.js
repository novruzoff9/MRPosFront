const count = $('.slide').length;
      function ChangeActive() {
        var activeIndex = $('.slide.active').index('.slide');

        $('.slide')
          .eq(activeIndex)
          .removeClass('active')
          .addClass('before-active');
        $('.slide')
          .eq(activeIndex - 1)
          .removeClass('before-active');

        activeIndex++;
        if (activeIndex === count - 1) {
          activeIndex = 1;
          $('.slide').removeClass('before-active');
          $('.slide').removeClass('after-active');
          $('.slide')
            .eq(activeIndex - 1)
            .addClass('before-active');
          $('.slide').eq(activeIndex).addClass('after-active');
        }

        $('.slide')
          .eq(activeIndex)
          .removeClass('after-active')
          .addClass('active');
        $('.slide')
          .eq(activeIndex + 1)
          .addClass('after-active');
      }

      var loopInterval = setInterval(ChangeActive, 3000);

      $('#nextcomment').click(function () {
        var afterIndex = $('.slide.active').index('.slide') + 1;
        if (afterIndex === count) {
          afterIndex = 0;
        }
        $('.slide')
          .eq(afterIndex - 2)
          .removeClass('before-active');
        $('.slide')
          .eq(afterIndex)
          .removeClass('after-active')
          .addClass('active');
        $('.slide')
          .eq(afterIndex - 1)
          .removeClass('active')
          .addClass('before-active');
        $('.slide')
          .eq(afterIndex + 1)
          .addClass('after-active');
        if (afterIndex === count - 1) {
          $('.slide').eq(0).addClass('after-active');
        }
      });

      $('#prevcomment').click(function () {
        var prevIndex = $('.slide.active').index('.slide') - 1;
        //if(afterIndex === -1) {afterIndex = 0;}
        $('.slide')
          .eq(prevIndex)
          .removeClass('before-active')
          .addClass('active');
        $('.slide')
          .eq(prevIndex - 1)
          .addClass('before-active');
        $('.slide')
          .eq(prevIndex + 1)
          .removeClass('active')
          .addClass('after-active');
        $('.slide')
          .eq(prevIndex + 2)
          .removeClass('after-active');
        // if(prevIndex === count - 1){
        //   $('.slide')
        //   .eq(0)
        //   .addClass('after-active');
        // }
      });