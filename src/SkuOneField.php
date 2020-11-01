<?php

namespace Sxc654\Sku;

use Encore\Admin\Form\Field;

class SkuOneField extends Field
{
    protected $view = 'sku::sku_field_one';

    protected static $js = [
        'vendor/sxc654/sku/sku_one.js'
    ];

    protected static $css = [
        'vendor/sxc654/sku/sku.css'
    ];

    public function render()
    {

        $this->script = <<< EOF
window.DemoSku = new SkuOne('{$this->getElementClassSelector()}');
EOF;
        return parent::render();
    }

}
