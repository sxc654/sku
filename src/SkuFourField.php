<?php

namespace Sxc654\Sku;

use Encore\Admin\Form\Field;

class SkuFourField extends Field
{
    protected $view = 'sku::sku_field_four';

    protected static $js = [
        'vendor/sxc654/sku/sku_four.js'
    ];

    protected static $css = [
        'vendor/sxc654/sku/sku.css'
    ];

    public function render()
    {

        $this->script = <<< EOF
window.DemoSku = new SkuFour('{$this->getElementClassSelector()}');
EOF;
        return parent::render();
    }

}
