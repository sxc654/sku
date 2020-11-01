<?php

namespace Sxc654\Sku;

use Encore\Admin\Form\Field;

class SkuTwoField extends Field
{
    protected $view = 'sku::sku_field_two';

    protected static $js = [
        'vendor/sxc654/sku/sku_two.js'
    ];

    protected static $css = [
        'vendor/sxc654/sku/sku.css'
    ];

    public function render()
    {

        $this->script = <<< EOF
window.DemoSku = new SkuTwo('{$this->getElementClassSelector()}');
EOF;
        return parent::render();
    }

}
