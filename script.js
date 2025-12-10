// ==================== 商品データ定義 ====================
const PRODUCT_DATA = [
    // サラダ系(店舗作成・原価率40%)
    { id: 1, name: "蟹づくしのパスタサラダ", price: 723, cost_rate: 40, is_factory: false },
    { id: 2, name: "ローストビーフサラダ マスカルポーネソース", price: 756, cost_rate: 40, is_factory: false },
    { id: 3, name: "京野菜入り 緑の30品目サラダ", price: 648, cost_rate: 40, is_factory: false },
    { id: 4, name: "北海道産生ハムとルッコラの華やぎサラダ", price: 594, cost_rate: 40, is_factory: false },
    { id: 5, name: "北海道産帆立と甘えびのサラダ", price: 723, cost_rate: 40, is_factory: false },
    { id: 6, name: "蓮根チップス入り 海老とじゃこのサラダ", price: 540, cost_rate: 40, is_factory: false },
    { id: 7, name: "香ばし揚げ舞茸とアボカドのサラダ", price: 550, cost_rate: 40, is_factory: false },
    { id: 8, name: "湯葉とちりめん山椒のサラダ 菊花入り", price: 496, cost_rate: 40, is_factory: false },
    { id: 9, name: "徳島県産れんこんと長芋のイタリアンサラダ", price: 475, cost_rate: 40, is_factory: false },
    { id: 10, name: "ほうれん草のサラダ 黒胡椒ハム＆モッツァレラ入り", price: 464, cost_rate: 40, is_factory: false },
    { id: 11, name: "乳酸菌&オリゴ糖 野菜たっぷりのポテトサラダ", price: 432, cost_rate: 40, is_factory: false },
    { id: 12, name: "2種ケールのサラダ", price: 453, cost_rate: 40, is_factory: false },
    { id: 13, name: "緑黄色野菜のシーザーサラダ", price: 394, cost_rate: 40, is_factory: false },
    
    // パック商品(工場作成・原価率60%)
    { id: 14, name: "1/2日分野菜 みつせ鶏のサラダ", price: 648, cost_rate: 60, is_factory: true },
    { id: 15, name: "1/2日分野菜 旨みまろやか海老マヨサラダ", price: 594, cost_rate: 60, is_factory: true },
    { id: 16, name: "ロースト冬野菜のシーザーサラダ", price: 540, cost_rate: 60, is_factory: true },
    { id: 17, name: "玄米ロール入り30品目のSalad bento", price: 1290, cost_rate: 60, is_factory: true },
    { id: 18, name: "ワインと愉しむ アンティパストセット", price: 1290, cost_rate: 60, is_factory: true },
    { id: 19, name: "野菜たっぷり 五目揚げ春巻き", price: 297, cost_rate: 60, is_factory: true },
    { id: 20, name: "ロールキャベツ 野菜を味わうトマトソース", price: 648, cost_rate: 60, is_factory: true }
];

// ==================== グローバル変数 ====================
let inventoryItems = []; // 在庫アイテムの配列

// ==================== 初期化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeProductSelect();
    setupEventListeners();
});

// 商品セレクトボックスの初期化
function initializeProductSelect() {
    const productSelect = document.getElementById('product-select');
    
    PRODUCT_DATA.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (¥${product.price.toLocaleString()})`;
        productSelect.appendChild(option);
    });
}

// イベントリスナーの設定
function setupEventListeners() {
    document.getElementById('add-inventory-btn').addEventListener('click', addInventory);
    document.getElementById('calculate-btn').addEventListener('click', calculateDiscounts);
}

// ==================== 在庫管理 ====================
function addInventory() {
    const productSelect = document.getElementById('product-select');
    const quantityInput = document.getElementById('quantity-input');
    
    const productId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);
    
    if (!productId) {
        alert('商品を選択してください。');
        return;
    }
    
    if (quantity <= 0) {
        alert('残量は1以上を入力してください。');
        return;
    }
    
    const product = PRODUCT_DATA.find(p => p.id === productId);
    
    // 既存の在庫をチェック
    const existingIndex = inventoryItems.findIndex(item => item.productId === productId);
    
    if (existingIndex !== -1) {
        // 既存の在庫を更新
        inventoryItems[existingIndex].quantity += quantity;
    } else {
        // 新しい在庫を追加
        inventoryItems.push({
            productId: productId,
            product: product,
            quantity: quantity
        });
    }
    
    // UI更新
    renderInventoryList();
    
    // 入力フィールドをリセット
    productSelect.value = '';
    quantityInput.value = 5;
}

function removeInventory(productId) {
    inventoryItems = inventoryItems.filter(item => item.productId !== productId);
    renderInventoryList();
}

function renderInventoryList() {
    const inventoryList = document.getElementById('inventory-list');
    
    if (inventoryItems.length === 0) {
        inventoryList.innerHTML = '<div class="empty-inventory">在庫が登録されていません。商品を追加してください。</div>';
        return;
    }
    
    inventoryList.innerHTML = inventoryItems.map(item => {
        const totalWeight = item.quantity * 100;
        const totalPrice = item.product.price * item.quantity;
        
        return `
            <div class="inventory-item">
                <div class="inventory-item-info">
                    <div class="inventory-item-name">${item.product.name}</div>
                    <div class="inventory-item-details">
                        単価: ¥${item.product.price.toLocaleString()} | 
                        残量: ${item.quantity}個 (${totalWeight}g) | 
                        合計: ¥${totalPrice.toLocaleString()}
                    </div>
                </div>
                <button class="inventory-item-remove" onclick="removeInventory(${item.productId})">🗑️ 削除</button>
            </div>
        `;
    }).join('');
}

// ==================== 値下げ計算 ====================
function calculateDiscounts() {
    if (inventoryItems.length === 0) {
        alert('在庫を追加してください。');
        return;
    }
    
    // 入力データの取得
    const inputData = {
        currentTime: parseInt(document.getElementById('current-time').value),
        currentSales: parseInt(document.getElementById('current-sales').value),
        existingDiscount: parseInt(document.getElementById('existing-discount').value) || 0,
        weather: document.querySelector('input[name="weather"]:checked').value,
        dayOfWeek: document.getElementById('day-of-week').value,
        inventory: inventoryItems
    };
    
    // 値下げ提案の計算
    const result = suggestDiscounts(inputData, PRODUCT_DATA);
    
    // 結果の表示
    displayResults(result, inputData);
}

function suggestDiscounts(inputData, productData) {
    const { currentTime, weather, dayOfWeek, inventory, existingDiscount } = inputData;
    
    // 営業時間の定義
    const CLOSING_TIME = 21; // 21時閉店
    const hoursUntilClosing = CLOSING_TIME - currentTime;
    
    // 売上目標の計算
    let salesTarget;
    if (dayOfWeek === 'weekday') {
        salesTarget = 200000; // 月～木: 20万円
    } else if (dayOfWeek === 'friday-saturday') {
        salesTarget = 230000; // 金・土: 23万円
    } else {
        salesTarget = 180000; // 日: 18万円
    }
    
    // 天気が雨の場合、売上目標を90%に
    if (weather === 'rainy') {
        salesTarget = Math.floor(salesTarget * 0.9);
    }
    
    // 在庫合計額の計算
    const inventoryTotal = inventory.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);
    
    // 提案候補リストの作成
    let proposals = [];
    
    inventory.forEach(item => {
        const product = item.product;
        const quantity = item.quantity;
        const price = product.price;
        const costRate = product.cost_rate;
        const isFactory = product.is_factory;
        
        let discountRate = 0;
        
        // 工場作成製品の特別ルール（在庫数・原価率無視）
        if (isFactory) {
            if (currentTime >= 20) {
                discountRate = 50; // 20時以降: 50%
            } else if (currentTime >= 19) {
                discountRate = 30; // 19時以降: 30%
            } else if (currentTime >= 18) {
                discountRate = 20; // 18時以降: 20%
            }
        } else {
            // A. 基本となる時間と金額による値下げルール（店舗作成品のみ）
            if (price >= 700) {
                // 700円以上の商品
                if (currentTime >= 18 && quantity >= 8) {
                    discountRate = 30;
                }
                if (currentTime >= 20 && quantity >= 5) {
                    discountRate = 50;
                }
            } else if (price >= 500) {
                // 500〜699円
                if (currentTime >= 18 && quantity >= 8) {
                    discountRate = 20;
                }
                if (currentTime >= 19 && quantity >= 5) {
                    discountRate = 30;
                }
            } else if (price >= 300) {
                // 300〜499円
                if (currentTime >= 18 && quantity >= 10) {
                    discountRate = 10;
                }
                if (currentTime >= 19 && quantity >= 7) {
                    discountRate = 20;
                }
                if (currentTime >= 20 && quantity >= 5) {
                    discountRate = 30;
                }
            }
        }
        
        // B. 例外処理(値下げをしない条件)
        if (discountRate > 0) {
            // 1. 閉店まで6時間以上ある場合
            if (hoursUntilClosing > 6) {
                discountRate = 0;
            }
            
            // 2. 原価割れ防止（工場作成品は除外）
            if (!isFactory) {
                const newPrice = price * (100 - discountRate) / 100;
                const costPrice = price * (costRate / 100);
                if (newPrice < costPrice) {
                    discountRate = 0;
                }
            }
            
            // 3. 少量在庫: 全商品の合計額が3000円以下
            if (inventoryTotal <= 3000) {
                discountRate = 0;
            }
        }
        
        // 提案候補に追加
        if (discountRate > 0) {
            const newPrice = Math.floor(price * (100 - discountRate) / 100);
            const discountAmount = (price - newPrice) * quantity;
            
            proposals.push({
                productId: product.id,
                productName: product.name,
                price: price,
                quantity: quantity,
                discountRate: discountRate,
                newPrice: newPrice,
                discountAmount: discountAmount
            });
        }
    });
    
    // C. 提案の優先順位と絞り込み
    proposals.sort((a, b) => {
        // 1. 金額(定価が高い)
        if (b.price !== a.price) return b.price - a.price;
        // 2. 残量が多い
        if (b.quantity !== a.quantity) return b.quantity - a.quantity;
        // 3. 値下げ率が高い
        return b.discountRate - a.discountRate;
    });
    
    // 最大5つに絞り込み
    proposals = proposals.slice(0, 5);
    
    // 提案値下げ額の合計
    const totalDiscountAmount = proposals.reduce((sum, p) => sum + p.discountAmount, 0);
    
    // 合計値下げ額（既存 + 提案）
    const totalAllDiscounts = existingDiscount + totalDiscountAmount;
    
    // D. 警告メッセージの判定（合計値下げ額で判定）
    const discountPercentage = (totalAllDiscounts / salesTarget) * 100;
    const showWarning = discountPercentage > 8;
    
    return {
        proposals: proposals,
        salesTarget: salesTarget,
        inventoryTotal: inventoryTotal,
        existingDiscount: existingDiscount,
        totalDiscountAmount: totalDiscountAmount,
        totalAllDiscounts: totalAllDiscounts,
        showWarning: showWarning
    };
}

// ==================== 結果表示 ====================
function displayResults(result, inputData) {
    const resultSection = document.getElementById('result-section');
    const salesTargetEl = document.getElementById('sales-target');
    const inventoryTotalEl = document.getElementById('inventory-total');
    const existingDiscountDisplayEl = document.getElementById('existing-discount-display');
    const discountTotalEl = document.getElementById('discount-total');
    const totalDiscountAmountEl = document.getElementById('total-discount-amount');
    const warningMessageEl = document.getElementById('warning-message');
    const proposalsListEl = document.getElementById('proposals-list');
    
    // 結果セクションを表示
    resultSection.style.display = 'block';
    
    // 合計情報の表示
    salesTargetEl.textContent = `¥${result.salesTarget.toLocaleString()}`;
    inventoryTotalEl.textContent = `¥${result.inventoryTotal.toLocaleString()}`;
    existingDiscountDisplayEl.textContent = `¥${result.existingDiscount.toLocaleString()}`;
    discountTotalEl.textContent = `¥${result.totalDiscountAmount.toLocaleString()}`;
    totalDiscountAmountEl.textContent = `¥${result.totalAllDiscounts.toLocaleString()}`;
    
    console.log('表示データ:', {
        existingDiscount: result.existingDiscount,
        totalDiscountAmount: result.totalDiscountAmount,
        totalAllDiscounts: result.totalAllDiscounts
    });    
    // 警告メッセージの表示
    if (result.showWarning) {
        warningMessageEl.textContent = '【注意】 合計値下げ額が売上目標の8%を超える可能性があります。';
        warningMessageEl.style.display = 'flex';
    } else {
        warningMessageEl.style.display = 'none';
    }
    
    // 提案リストの表示
    if (result.proposals.length === 0) {
        proposalsListEl.innerHTML = '<div class="no-proposals">現在、値下げを提案する商品は見つかりません。</div>';
    } else {
        proposalsListEl.innerHTML = result.proposals.map(proposal => {
            return `
                <div class="proposal-item">
                    💰 <strong>${proposal.productName}</strong> を <strong>${proposal.discountRate}%</strong> 引きしませんか？ 
                    (新価格: <strong>¥${proposal.newPrice.toLocaleString()}</strong>)
                </div>
            `;
        }).join('');
    }
    
    // 結果セクションまでスクロール
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
