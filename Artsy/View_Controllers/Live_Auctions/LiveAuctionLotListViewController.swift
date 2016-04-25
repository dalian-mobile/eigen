import UIKit
import Interstellar


protocol LiveAuctionLotListViewControllerDelegate: class {
    func didSelectLotAtIndex(index: Int, forLotListViewController lotListViewController: LiveAuctionLotListViewController)
}

class LiveAuctionLotListViewController: UICollectionViewController {
    let lots: [LiveAuctionLotViewModelType]
    let currentLotSignal: Observable<LiveAuctionLotViewModelType>
    let stickyCollectionViewLayout: LiveAuctionLotListStickyCellCollectionViewLayout
    let auctionViewModel: LiveAuctionViewModelType

    weak var delegate: LiveAuctionLotListViewControllerDelegate?

    private var currentLotSignalObserver: ObserverToken!

    init(lots: [LiveAuctionLotViewModelType], currentLotSignal: Observable<LiveAuctionLotViewModelType>, auctionViewModel: LiveAuctionViewModelType) {
        self.lots = lots
        self.currentLotSignal = currentLotSignal
        self.stickyCollectionViewLayout = LiveAuctionLotListStickyCellCollectionViewLayout()
        self.auctionViewModel = auctionViewModel

        super.init(collectionViewLayout: self.stickyCollectionViewLayout)

        currentLotSignalObserver = currentLotSignal.subscribe { [weak self] lot in
            self?.stickyCollectionViewLayout.setActiveIndex(lot.lotIndex)
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    deinit {
        currentLotSignal.unsubscribe(currentLotSignalObserver)
    }

    override func viewDidLoad() {
        collectionView?.backgroundColor = .whiteColor()
        title = "Lots"

        collectionView?.registerClass(LotListCollectionViewCell.self, forCellWithReuseIdentifier: LotListCollectionViewCell.CellIdentifier)
    }

    func lotAtIndexPath(indexPath: NSIndexPath) -> LiveAuctionLotViewModelType {
        return lots[indexPath.item]
    }
}


private typealias CollectionView = LiveAuctionLotListViewController
extension CollectionView {
    override func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return lots.count
    }

    override func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier(LotListCollectionViewCell.CellIdentifier, forIndexPath: indexPath)

        let viewModel = lotAtIndexPath(indexPath)
        (cell as? LotListCollectionViewCell)?.configureForViewModel(viewModel, auctionViewModel: auctionViewModel, indexPath: indexPath)

        return cell
    }

    override func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {
        collectionView.deselectItemAtIndexPath(indexPath, animated: true)
        delegate?.didSelectLotAtIndex(indexPath.item, forLotListViewController: self)
    }
}


